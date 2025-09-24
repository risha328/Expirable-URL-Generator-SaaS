import express from 'express';
import { sendMessage } from '../controllers/chatbotController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/message', authMiddleware, sendMessage);

export default router;
