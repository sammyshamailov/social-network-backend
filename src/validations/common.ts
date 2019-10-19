import joi from 'joi';

const passwordSchema = joi.string().required().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
const emailScehma = joi.string().required().regex(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/);

export { passwordSchema, emailScehma };