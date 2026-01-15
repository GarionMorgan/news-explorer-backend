import express from 'express';
import authRoutes from './auth.js';
import usersRoutes from './users.js';
import articlesRoutes from './articles.js';
import uploadsRoutes from './uploads.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);
router.use('/uploads', uploadsRoutes);

export default router;
