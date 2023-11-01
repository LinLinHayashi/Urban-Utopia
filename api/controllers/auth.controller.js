import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => { // "next" here refers to the middleware we will be using.
  const {username, email, password} = req.body; // Using object destructuring, create three new constant variables: "username", "email", and "password", each containing the corresponding values from "req.body".
  const hashedPassword = bcryptjs.hashSync(password, 10); // Hash the password with 10 rounds using bcryptjs.
  const newUser = new User({username, email, password: hashedPassword}); // Use the "User" model we created to store the new user's information in an instance "newUser".
  try {
    await newUser.save(); // Store "newUser" in the database.
    res.status(201).json('User created successfully!');
  } catch(error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email}); // Query the database for a User record that has a "email": "email" key-value pair. The found User record will be stored in "validUser". If not found, "validUser" will be null.
    if (!validUser) return next(errorHandler(404, 'User not found!')); // If the User record isn't found, return an error.
    const validPassword = bcryptjs.compareSync(password, validUser.password); // Compare "password" with the hashed password of the User record.
    if (!validPassword) return next(errorHandler(401, 'Incorrect password!')); // If the password is invalid, return an error.
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET); // Create a token using the User record's id in the MongoDB database and the JWT secret key only for our application.

    // This is how we exclude the password from the response sent to the user for security purpose.
    const {password: pass, ...rest} = validUser._doc; // "rest" stores all attributes of "validUser._doc", which is the User record's information sent through the response, except the password.

    // Create a cookie for the User record using the token, give it a name, and set it to expire in 90 days.
    res.cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 90)}).status(200).json(rest); // Note that we only send "rest" through the response.

  } catch(error) {
    next(error);
  }
};