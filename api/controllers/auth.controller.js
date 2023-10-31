import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js';

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