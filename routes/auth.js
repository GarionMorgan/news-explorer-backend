// routes/auth.js

import express from 'express';
import { signup, signin, signout, me } from '../controllers/authController.js';
import {
  signupValidator,
  signinValidator,
} from '../validators/authValidators.js';
import auth from '../middlewares/auth.js';
import {
  headersValidator,
  headersAuthValidator,
} from '../validators/commonValidators.js';

const router = express.Router();

router.post('/signup', headersValidator, signupValidator, signup);
router.post('/signin', headersValidator, signinValidator, signin);
router.post('/signout', signout);
router.get('/me', headersAuthValidator, auth, me);

export default router;
