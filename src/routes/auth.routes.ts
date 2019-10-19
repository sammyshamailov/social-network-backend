import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { passwordValidation, emailValidation } from '../middleware/validation';

const router = Router();

router.post('/api/auth/register', passwordValidation, emailValidation, authController.register);

router.post('/api/auth/login', authController.login);

export default router;