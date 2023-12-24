import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'; // We import the router from the specified file but change its name.
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config(); // Validate the .env file.
mongoose.connect(process.env.MONGO).then(() => console.log('Connect to MongoDB!')).catch(err => console.log(err)); // Connect the server to MongoDB.

const __dirname = path.resolve(); // "__dirname" is a global variable that represents the directory name of the current module. "path.resolve()" resolves a sequence of paths or path segments into an absolute path. This line of code assigns the absolute path of the current module's directory to the "__dirname" variable.

const app = express(); // This creates the server.

app.use(express.json()); // This allows the server to accept requests with a JSON body.

app.use(cookieParser()); // We need this to verify tokens.

// Run the server.
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

// This is how we call an API router.
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

/*
  1. "__dirname" represents the directory name of the current module.
  2. "/client/dist" is a relative path that is appended to "__dirname" using "path.join()" to form the complete path to the static files directory.
  3. "express.static()" is a middleware function in Express that serves static files such as HTML, images, CSS, and JS files. It takes the directory path containing the static files as an argument.
  4. "app.use()" works as usual.
*/
app.use(express.static(path.join(__dirname, '/client/dist'))); // Note that this line of code must be after the API routers.

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// The middleware for error handling.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false, // If there is an error, "success" will be set to false.
    statusCode,
    message,
  });
});