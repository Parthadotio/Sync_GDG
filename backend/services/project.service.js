import projectModel from "../models/project.model.js"
import mongoose from "mongoose";


//create project
export const createProject = async ({ name, userId }) => {
     
    if (!name) {
        throw new Error("Name is required");
        
    }

    if (!userId) {
        throw new Error ("User id is required");
        
    }


    const project = await projectModel.create({
        name,
        users : [userId]
    });

    return project;


}



//All projects
export const getAllProjectByUserId = async ({userId}) => {
    if(!userId) {
        throw new Error('User id is required')
    }

    const allUserProjects = await projectModel.find ({
        users: userId
    })

    return allUserProjects
}



//Add user to the project
export const addUserToProject = async ({ projectId, users, userId }) => {

    if(!projectId) {
        throw new Error('Project id required')
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project id')
    }

    if(!users) {
        throw new Error('User required')
    }

    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }


    if(!userId) {
        throw new Error('Invalid user id')
    }

    
    const project = await projectModel.findOne ({
        _id : projectId ,
        users : userId
    })

    
    if(!project) {
        throw new Error ('User not belogs to the project')
    }

    const updatedProject = await projectModel.findOneAndUpdate ({
        
        _id : projectId

    }, {
        $addToSet : {
            users : {
                $each : users
            }
        }
    } ,{
        new : true
    })

    return updatedProject
}


//project id
export const getProjectById = async ({ projectId }) => {

    if(!projectId) {
        throw new Error ('Invalid project id')
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project id')
    }

    const project = await projectModel.findOne ({
        _id: projectId
    }).populate('users')

    return project;
}

//file tree
export const updateFileTree = async ({ projectId, fileTree }) => {

    if(!projectId) {
        throw new Error('Project id is required')
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project id')
    }

    if(!fileTree) {
        throw new Error('File tree required')
    }

    const project = await projectModel.findOneAndUpdate({
        _id : projectId 
        },
        {
            fileTree
        },
        {
            new : true
        },
    )

    return project;
}