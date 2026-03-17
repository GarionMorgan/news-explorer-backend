// routes/articles.js
import express from 'express';
import auth from '../middlewares/auth.js';
import { headersValidator } from '../validators/commonValidators.js';
import {
  getArticles,
  createArticle,
  deleteArticle,
} from '../controllers/articlesController.js';
import {
  createArticleValidator,
  articleIdParamValidator,
  deleteByUrlValidator,
} from '../validators/articlesValidators.js';

const router = express.Router();

// debug middleware: log request body for POST /articles to help diagnose validation
const logRequestBody = (req, res, next) => next();

router.get('/', headersValidator, auth, getArticles);
router.post(
  '/',
  headersValidator,
  auth,
  logRequestBody,
  createArticleValidator,
  createArticle
);
router.delete(
  '/:articleId',
  headersValidator,
  auth,
  articleIdParamValidator,
  deleteArticle
);
router.delete('/', headersValidator, auth, deleteByUrlValidator, deleteArticle);

export default router;
