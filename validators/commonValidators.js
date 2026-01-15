// validators/commonValidators.js
import { celebrate, Joi, Segments } from 'celebrate';

// Validate Authorization header (Bearer token). Use unknown(true) so other
// headers are allowed through.
export const authHeaderValidator = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string()
      .pattern(/^Bearer\s+\S+$/)
      .required(),
  }).unknown(true),
});

// Validate Content-Type header for JSON requests (allows optional charset)
export const contentTypeValidator = celebrate({
  [Segments.HEADERS]: Joi.object({
    'content-type': Joi.string()
      .pattern(/^application\/json(?:;.*)?$/i)
      .required(),
  }).unknown(true),
});

// Validate Accept header to ensure the client accepts JSON responses. We
// allow `*/*` and `application/*` as permissive values.
export const acceptJsonValidator = celebrate({
  [Segments.HEADERS]: Joi.object({
    accept: Joi.string()
      .required()
      .custom((val, helpers) => {
        if (/application\/json|\*\/*|application\/\*/i.test(val)) return val;
        return helpers.error('any.invalid');
      }),
  }).unknown(true),
});

export default {
  authHeaderValidator,
  contentTypeValidator,
  acceptJsonValidator,
};
