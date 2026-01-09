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

router.get("/", auth, getArticles);
router.post("/", auth, createArticleValidator, createArticle);
router.delete("/:articleId", auth, articleIdParamValidator, deleteArticle);
router.delete("/", auth, deleteByUrlValidator, deleteArticle);

export default router;
