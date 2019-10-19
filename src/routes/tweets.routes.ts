import { Router } from 'express';
import * as tweetsController from '../controllers/tweets.controller';
import { auth } from '../middleware/auth';
import { idValidation } from '../middleware/validation';

const router = Router();

router.get('/api/tweets', tweetsController.getAll);

router.post('/api/tweets', auth(), tweetsController.addTweet);

router.delete('/api/tweets/:id', auth(), idValidation,  tweetsController.deleteTweet);

router.post('/api/tweets/:id/star-toggle', auth(), idValidation, tweetsController.starTweet);

export default router;
