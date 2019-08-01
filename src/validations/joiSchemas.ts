import joi from 'joi';

export const productNameSchema = joi.object().keys({
  name: joi.string().min(5).required(),
});

export const idSchema = joi.string().min(36).max(36);
  