import joi from 'joi';

export const productNameSchema = joi.string().min(3).required();

export const idSchema = joi.string().min(36).max(36);
  