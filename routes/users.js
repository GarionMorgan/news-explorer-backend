// routes/users.js
import express from 'express';
import auth from '../middlewares/auth.js';
import getCurrentUser from '../controllers/usersController.js';
import { headersAuthValidator } from '../validators/commonValidators.js';

const router = express.Router();

router.get('/me', headersAuthValidator, auth, getCurrentUser);

export default router;
