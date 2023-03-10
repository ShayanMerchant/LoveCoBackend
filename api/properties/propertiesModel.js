const mongoose = require('mongoose');
const Joi = require('joi');

// User Schema
const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50,
    },
    beds: {
        type: Number,
        required: true,
        maxlength: 20,
    },
    bathroom: {
        type: Number,
        required: true,
        maxlength: 20,
    },
    parking: {
        type: Number,
        required: true,
        maxlength: 20,
    },
    details: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10000,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    agentName: {
        type: String,
        required: true,
        maxlength: 50,
    },
    agentPhoneNumber: {
        type: Number,
        required: true,
        maxlength: 10,
    },
    agentEmailAddress: {
        type: String,
        required: true,
        maxlength: 50,
    },
    images: {
        type: Array,
        maxlength: 10,
    },
    createdAt: {
        type: Date,
        required: true,
        default:  new Date().toLocaleString('en-US', {
            timeZone: 'Australia/Melbourne'
          })
    },

});

const Property = mongoose.model('Property', propertySchema);

// Validating Schema
function validateProperty(property) {
    const schema = {
        title: Joi.string().max(50).required(),
        beds: Joi.number().max(10).required(),
        bathroom: Joi.number().max(10).required(),
        parking: Joi.number().max(10).required(),
        details: Joi.string().min(10).max(10000).required(),
        price: Joi.number().required(),
        type: Joi.string().required(),
        agentName: Joi.string().max(50).required(),
        agentPhoneNumber: Joi.string().max(10).required(),
        agentEmailAddress: Joi.string().max(50).required().email(),
        images: Joi.array().max(10),
    };

    return Joi.validate(property, schema);   
}

exports.Property = Property;
exports.validate = validateProperty;