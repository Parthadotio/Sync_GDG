import * as ai from '../services/ai.service.js'

export const getResult = async (req, res) => {

    try {

        const { prompt } = req.query;
        const results = await ai.generateResult(prompt);
        res.send(results);
        
    } catch (error) {
        
        console.log(error);
        

        res.status(400).send({ message : error.message });
        
    }
}