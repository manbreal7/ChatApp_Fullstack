import { Router } from 'express';
import wrapAsync from '../middlewares/wrapAsync.js';
import { authorization } from '../middlewares/authorization.js';
import * as chatController from '../controllers/chat.js';

const router = Router();

router.post('/', authorization, wrapAsync(chatController.postChat));
router.get('/', authorization, wrapAsync(chatController.getChat));

router.post('/group', authorization, wrapAsync(chatController.createGroup));
router.delete(
	'/deleteGroup/:chatId',
	authorization,
	wrapAsync(chatController.deleteGroup)
);
router.post('/rename', authorization, wrapAsync(chatController.renameGroup));
router.post(
	'/groupremove',
	authorization,
	wrapAsync(chatController.removeFromGroup)
);
router.post('/groupadd', authorization, wrapAsync(chatController.addToGroup));

export default router;
