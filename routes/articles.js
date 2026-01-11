// routes/articles.js
import express from "express";
import auth from "../middlewares/auth.js";
import {
  getArticles,
  createArticle,
  deleteArticle,
} from "../controllers/articlesController.js";
import {
  createArticleValidator,
  articleIdParamValidator,
} from "../validators/articlesValidators.js";
import { deleteByUrlValidator } from "../validators/articlesValidators.js";

const router = express.Router();

// debug middleware: log request body for POST /articles to help diagnose validation
const logRequestBody = (req, res, next) => next();

router.get("/", auth, getArticles);
router.post("/", auth, logRequestBody, createArticleValidator, createArticle);
router.delete("/:articleId", auth, articleIdParamValidator, deleteArticle);
router.delete("/", auth, deleteByUrlValidator, deleteArticle);

export default router;
