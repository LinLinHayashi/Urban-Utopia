import Listing from '../models/listing.model.js';
import {errorHandler} from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  // If the listing doesn't exist.
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  // If the requesting user is not requesting to delete their own listing.
  if (req.user.id !== listing.userRef){
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error){
    next(error);
  }
};