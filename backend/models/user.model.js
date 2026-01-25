import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

//user Schema
const userSchema = new mongoose.Schema({

    userName : {
        type : String,
        required : true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [ 6,'Email must be 6 character long' ],
        maxLength: [50,'Email must no longer then 50 characters']
    },


    password : {
        type: String,
        select: false,
    }
})


//user methods
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function () {
    return jwt.sign({email: this.email,
        _id: this._id.toString() 
    }, process.env.JWT_SECRET, {
        expiresIn : '24h'
    });
}

const User = mongoose.model('user', userSchema);


export default User;