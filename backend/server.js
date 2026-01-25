import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import projectModel from './models/project.model.js'
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 9000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {

        origin : '*'
    }
});

io.use(async (socket, next) => {
    
    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ') [ 1 ];
        const projectId = socket.handshake.query.projectId;


        if(!mongoose.Types.ObjectId.isValid(projectId)) {
            return next (new Error('Invalid Project Id'));
        }
        
        const project = await projectModel.findById(projectId);

        if(!project) {
            return next(new Error('Project not found'))
        }

        socket.projectId = project._id.toString();

        if(!token) {
            return next(new Error('Authoraization Error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return next(new Error('Authoraization Error'));
        }
        
        socket.user = decoded;

        next();

    } catch (error) {
        
         next(error)

    }
})

io.on('connection', socket => {

    socket.roomId = socket.projectId;

    console.log('A user is connected');

    socket.join(socket.roomId);
  

    socket.on('project-message',async data => {

       const message = data.message

       const sanitizedSender = data.sender ? {
            _id: data.sender._id,
            email: data.sender.email,
            userName: data.sender.userName
       } : null;

      const storedMessage = {
          message,
          sender: sanitizedSender,
          timestamp: data.timestamp || new Date().toISOString()
      };

       const aiIsPresent = message.includes('@ai')
       socket.broadcast.to(socket.roomId).emit('project-message', data)
       
        try {
            await projectModel.findByIdAndUpdate(socket.projectId, {
                $push: { messages: storedMessage }
            });
        } catch (error) {
            console.error('Failed to persist message', error);
        }
        
        if(aiIsPresent) {

            const prompt = message.replace('@ai', '')
            try {
                const result = await generateResult(prompt);

                const aiMessage = {
                    message: result,
                    sender : {
                        _id: 'ai',
                        email: 'AI'
                    },
                    timestamp: new Date().toISOString()
                };

                try {
                    await projectModel.findByIdAndUpdate(socket.projectId, {
                        $push: { messages: aiMessage }
                    });
                } catch (error) {
                    console.error('Failed to persist AI message', error);
                }

                io.to(socket.roomId).emit('project-message', aiMessage)
            } catch (error) {
                console.error('AI generation failed', error);

                const fallbackAiMessage = {
                    message: JSON.stringify({ text: 'AI is unavailable right now. Please try again later.', fileTree: null }),
                    sender : {
                        _id: 'ai',
                        email: 'AI'
                    },
                    timestamp: new Date().toISOString()
                };

                io.to(socket.roomId).emit('project-message', fallbackAiMessage)
            }

            return
        }

    })
    
    // socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { 
        socket.leave(socket.roomId);
        
    });

});



server.listen(port, () => {
    console.log(`Server is running on port ${ port }`);
})