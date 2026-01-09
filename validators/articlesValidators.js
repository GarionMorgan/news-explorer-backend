// validators/articlesValidators.js
import { celebrate, Joi, Segments } from "celebrate";

export const createArticleValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().uri().required(),
    image: Joi.string().uri().required(),
  }),
});

export const articleIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
});

export const deleteByUrlValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    url: Joi.string().uri().required(),
  }),
});

export default { createArticleValidator, articleIdParamValidator };
