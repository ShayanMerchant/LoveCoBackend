const express = require('express');
const router = express.Router();
const property = require('./propertiesController');
const upload = require('../../middleware/upload');

router.post('/addProperty', property.addProperty);

router.get('/getProperties', property.getProperties);

router.post('/images/:id' , upload.array('images', 10), property.addImage);

module.exports = router;