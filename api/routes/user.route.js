import express from 'express';
import {test} from '../controllers/user.controller.js';

// This is how we create an API router.
const router = express.Router();
router.get('/test', test);

export default router;