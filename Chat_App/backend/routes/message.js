import express from 'express';
import wrapAsync from '../middlewares/wrapAsync.js';
import { authorization } from '../middlewares/authorization.js';
import * as messageController from '../controllers/message.js';

const router = express.Router();

router.post("/", authorization, wrapAsync(messageController.sendMessage));
router.get("/:chatId", authorization, wrapAsync(messageController.getMessages));
router.get(
	"/clearChat/:chatId",
	authorization,
	wrapAsync(messageController.clearMessages)
);

export default router;
