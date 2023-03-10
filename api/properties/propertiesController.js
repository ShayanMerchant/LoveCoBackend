const _ = require('lodash');    
const {Property, validate} = require('./propertiesModel');

// add property
exports.addProperty = async function (req, res) {
    // validation
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let property = await Property.findOne({title: req.body.title});
    if(property) return res.status(400).send('Property Already Exist');

    // Adding a new property
    property = new Property(_.pick(req.body, ['title', 'beds', 'bathroom', 'parking', 'details', 'price', 'type', 'agentName', 'agentPhoneNumber', 'agentEmailAddress', 'createdAt']));

    // Saving a newly created user
    await property.save();
    res.send(_.pick(property, ['title', 'beds', 'bathroom', 'parking', 'details', 'price', 'type', 'agentName', 'agentPhoneNumber', 'agentEmailAddress', 'createdAt', 'images']));
};

// getting all properties
exports.getProperties = async function (req, res) {

    let property = await Property.find();
    res.send(property); 
};

exports.addImage = async function (req, res) {

     // Checking if property exist in our db or not
     const property = await Property.findById(req.params.id);
     if(!property) return res.status(404).send('Property Not Found');
 
     // Adding Images
     property.images = req.files.map(item => item.path)
 
     // Saving property
     await property.save();
     return res.send(req.files);
};