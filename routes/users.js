// routes/users.js
import express from 'express';
import auth from '../middlewares/auth.js';
import getCurrentUser from '../controllers/usersController.js';
import {
  authHeaderValidator,
  acceptJsonValidator,
} from '../validators/commonValidators.js';

const router = express.Router();

router.get(
  '/me',
  acceptJsonValidator,
  authHeaderValidator,
  auth,
  getCurrentUser,
);

export default router;
