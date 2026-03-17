// validators/articlesValidators.js
import { celebrate, Joi, Segments } from 'celebrate';

export const createArticleValidator = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      // core required fields (allow frontend/backends shapes)
      keyword: Joi.string().required(),
      title: Joi.string().required(),

      // article text can be `text` (backend) or `description` (frontend)
      text: Joi.string(),
      description: Joi.string(),

      // date can be `date` or `publishedAt`
      date: Joi.string(),
      publishedAt: Joi.string(),

      // source can be a simple string or an object with `name`
      source: Joi.alternatives()
        .try(Joi.string(), Joi.object({ name: Joi.string().required() }))
        .required(),

      // link/url and image/urlToImage - accept either naming
      link: Joi.string().uri(),
      url: Joi.string().uri(),
      image: Joi.string().uri(),
      urlToImage: Joi.string().uri(),
    })
    // require at least one of the alternate fields to be present
    .or('text', 'description')
    .or('date', 'publishedAt')
    .or('link', 'url')
    .or('image', 'urlToImage'),
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
