import mongoose from 'mongoose';

// Create a schema in the MongoDB collection.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: false
  },
  avatar: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  isGoogle: {
    type: Boolean,
    default: false
  }
}, {timestamps: true}); // Include two extra time information: creation time of the user and update time of the user.

// Create a "User" model applying the schema in the MongoDB collection.
const User = mongoose.model('User', userSchema);

export default User;