const express = require('express');
const config = require('config');
const joi = require('joi');
joi.objectId = require('joi-objectId')(joi);
require('./db');

// Routes
const users = require('./api/users/userRoutes');
const properties = require('./api/properties/propertiesRoutes');

const app = express();

if (!config.get('jwtPrivateKey')) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  }

app.use(express.json());

app.use('/api/users' , users);
app.use('/api/properties', properties);


app.get('/' , (req, res) => {
    res.json({success: true, message: "Welcome to backend zone"});
})

app.use('/uploads', express.static(__dirname + '/uploads')); //can access upload folder publicly

app.listen(8000, () => {
    console.log('Port is listening')
});
