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

    // Create a cookie for the User record using the token of the name "access_token", and set it to expire in 90 days.
    res.cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}).status(200).json(rest); // Note that we only send "rest" through the response.

  } catch(error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});

    // If "user" is not null; this means we found a User record in the database that matches the email.
    if (user) {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;
      res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);

    // If "user" is null; this means we didn't find a User record in the database that matches the email and we need to create it.
    } else {

      // Since User model requires a password, but the Google-authenticated user has no password, we need to create a password to create the User record.
      const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random number between 0 and 1 and converts it into a base-36 string (0 to 9 and "a" to "z"), and then take the last 8 digits of it. We concatenate two such strings to form a 16-digit password.

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo, isGoogle: true}); // Note that this is how we process a user name like "Lin Lin". We conver it to "linlin" first and then concatenate it with a random 4-digit string.
      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;
      res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }
  } catch(error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token'); // Sign out by deleting the cookie.
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
