// routes/articles.js
import express from 'express';
import auth from '../middlewares/auth.js';
import {
  authHeaderValidator,
  contentTypeValidator,
  acceptJsonValidator,
} from '../validators/commonValidators.js';
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

router.get('/', acceptJsonValidator, authHeaderValidator, auth, getArticles);
router.post(
  '/',
  contentTypeValidator,
  acceptJsonValidator,
  authHeaderValidator,
  auth,
  logRequestBody,
  createArticleValidator,
  createArticle,
);
router.delete(
  '/:articleId',
  acceptJsonValidator,
  authHeaderValidator,
  auth,
  articleIdParamValidator,
  deleteArticle,
);
router.delete(
  '/',
  contentTypeValidator,
  acceptJsonValidator,
  authHeaderValidator,
  auth,
  deleteByUrlValidator,
  deleteArticle,
);

export default router;
