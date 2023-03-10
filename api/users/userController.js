const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User, validate} = require('../users/userModel');
const sendEmail = require('../../utils/sendEmail');

// getting user by id
exports.byId = async function(req, res) {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
};

// sign up
exports.signUp = async function(req, res) {
    // validation
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if email alreay exist in our db or not
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User Already Exist');

    // Creating a new user 
    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'image',]));

    // Hashing a password 
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password , salt);

    // Saving a newly created user
    await user.save();

    // Getting a token for newly created user
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName', 'email', 'phoneNumber', 'image',]));
};

// sign in
exports.signIn = async function(req, res) {

    // validation
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if User exist or not
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid Email or password');

    // Validating Password
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send('Invalid Email or Password');
    const token = user.generateAuthToken();
    res.send({
        user: user,
        token: token
    });

    function validate(req) {
        const schema = {
            email: Joi.string().min(5).max(255).required(),
            password: Joi.string().min(3).max(255).required(),
        };
    
        return Joi.validate(req, schema);   
    };
};

// profile picture
exports.userImage = async function(req, res) {

     // Checking if user exist in our db or not
     const user = await User.findById(req.params.id);
     if(!user) return res.status(404).send('User Not Found');
 
     // Adding Image
     user.image = req.body.image;
 
     // Saving user
     await user.save();
     return res.send(user);
};

// update user
exports.updateUser = async function(req, res) {

     // Validation
   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);

    // Checking if user exist in our db or not
    const user = await User.findByIdAndUpdate(
        req.params.id, 
        {$set: {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, phoneNumber: req.body.phoneNumber}},
        {new: true});
    if(!user) return res.status(404).send('User Not Found');

   // return the updated user  
   console.log(user);
   return res.send(user);

   function validate(req) {
    const schema = {
        firstName: Joi.string().max(50),
        lastName: Joi.string().max(50),
        email: Joi.string().min(5).max(255).email(),
        phoneNumber: Joi.string().min(10).max(10),

    };

    return Joi.validate(req, schema);   
};
};

// password reset link
exports.userPasswordResetLink = async function (req, res) {

    // validation
    const schema = Joi.object({email: Joi.string().min(5).max(255).required().email()});
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    // Checking if email alreay exist in our db or not
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('User Does Not Exist');
 
    // Password Reset Link
    const link = `${process.env.BASE_URL}/users/userPasswordReset/${user._id}`;
    await sendEmail(user.email, "Password Reset", link);

    console.log(link);

    res.send("Password reset link send to the email");
};

// password reset
exports.userPasswordReset = async function (req, res) {

    // validation
    const schema = Joi.object({password: Joi.string().min(6).max(255).required()});
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if email alreay exist in our db or not
    let user = await User.findById(req.params.id);
    if(!user) return res.status(400).send('Invalid or Expired Link');

    // Password Reset
    user.password = req.body.password;

    // Hashing the password
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password , salt);

    // Saving to db
    await user.save();

    res.send("Password reset sucessfully.");
};

