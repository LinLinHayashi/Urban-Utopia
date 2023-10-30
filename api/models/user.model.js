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
}, {timestamps: true}); // Include two extra time information: creation time of the user and update time of the user.

// Create a "User" model applying the schema in the MongoDB collection.
const User = mongoose.model('User', userSchema);

export default User;