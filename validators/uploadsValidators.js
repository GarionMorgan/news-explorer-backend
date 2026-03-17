// validators/uploadsValidators.js
import { celebrate, Joi, Segments } from 'celebrate';

// Validate `id` route param used to identify images. Accept either a 24-char
// hex ObjectId or a filename string (no path traversal characters).
export const imageIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.alternatives()
      .try(Joi.string().hex().length(24), Joi.string().pattern(/^[^\\/\\\\]+$/))
      .required(),
  }),
});

export default { imageIdParamValidator };
