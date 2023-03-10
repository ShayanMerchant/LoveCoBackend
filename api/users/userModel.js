const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

// User Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    phoneNumber: {
        type: Number,
        required: true,
        maxlength: 10,
    },
    image: {},
    isAdmin: {
        type: Boolean,
    },
});

// Generating Auth Token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

// Validating Schema
function validateUser(user) {
    const schema = {
        firstName: Joi.string().max(50).required(),
        lastName: Joi.string().max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
        phoneNumber: Joi.string().max(10).required(),
        image: Joi.string(),
    };

    return Joi.validate(user, schema);   
}

exports.User = User;
exports.validate = validateUser;