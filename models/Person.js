const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    father:{type:String,required:true},
    birthday: { type: Date, required: false }, 
    anniversary: { type: Date, required: false }, 
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: "7d" });
};

const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
        father:Joi.string().required(),
        birthday: Joi.date().optional(), 
        anniversary: Joi.date().optional(), 
    });
    return schema.validate(data);
};

const User = mongoose.model("User", userSchema);
module.exports = { User, validate };
