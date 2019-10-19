import { Router } from 'express';
import * as membersController from '../controllers/members.controller';
import { idValidation } from '../middleware/validation';

const router = Router();

router.get('/api/members/:id', idValidation, membersController.getMember);

router.get('/api/members/:id/tweets', idValidation, membersController.getMemberTweets);

export default router;
