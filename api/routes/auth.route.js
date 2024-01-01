import express from 'express';
import {signup, signin, google, signout} from '../controllers/auth.controller.js';
import {tokenExist} from '../utils/verifyUser.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);
router.get('/token', tokenExist);

export default router;