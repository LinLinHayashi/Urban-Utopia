import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import {errorHandler} from '../utils/error.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
  res.json({
    message: 'Test API router is working!'
  });
};

export const updateUser = async (req, res, next) => {

  // If the requesting user is not requesting to update their own user info, return the error.
  if (req.user.id != req.params.id) return next(errorHandler(401, 'You can only update your won account!'));

  try {

    // If the requesting user is requesting to update their password, hash the password first.
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // "findByIdAndUpdate" function will find the User record of "req.params.id" and update those attributes in "$set". Attributes in "$set" will be updated if new value is sent through request for that attribute and will stay the same if no value is sent through request for that attribute.
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      $set: { // Note that here we can't simply put "req.body" in "$set" since a hacker would use this to change some hidden attributes (such as "admin: true") of User records.
        username: req.body.username,
        email:req.body.email,
        password:req.body.password,
        avatar: req.body.avatar
      }}, {new: true} // We need "{new: true}" here to validate the update.
    );

    const {password, ...rest} = updateUser._doc;
    res.status(200).json(rest);
  } catch(error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {

  // If the requesting user is not requesting to delete their own user account, return the error.
  if (req.user.id != req.params.id) return next(errorHandler(401, 'You can only delete your won account!'));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token'); // We delete the cookie. Note that the cookie must be deleted before sending the response.
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id){
    try {
      const listing = await Listing.find({userRef: req.params.id});
      res.status(200).json(listing);
    } catch (error){
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found!'));
    const {password: pass, ...rest} = user._doc;
    res.status(200).json(rest);
  } catch (error){
    next(error);
  }
};