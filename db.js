const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI,
    {useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false})
.then(() => {console.log('db is connected')})
.catch(err => console.error(err));