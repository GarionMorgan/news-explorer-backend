// routes/auth.js

import express from 'express';
import {
  signup, signin, signout, me,
} from '../controllers/authController.js';
import {
  signupValidator,
  signinValidator,
} from '../validators/authValidators.js';
import auth from '../middlewares/auth.js';
import {
  authHeaderValidator,
  contentTypeValidator,
  acceptJsonValidator,
} from '../validators/commonValidators.js';

const router = express.Router();

router.post(
  '/signup',
  contentTypeValidator,
  acceptJsonValidator,
  signupValidator,
  signup,
);
router.post(
  '/signin',
  contentTypeValidator,
  acceptJsonValidator,
  signinValidator,
  signin,
);
router.post('/signout', signout);
router.get('/me', acceptJsonValidator, authHeaderValidator, auth, me);

export default router;
