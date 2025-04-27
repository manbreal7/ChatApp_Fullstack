import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';
import wrapAsync from '../middlewares/wrapAsync.js';

const router = Router();

router.post('/signup', wrapAsync(registerUser));
router.post('/signin', wrapAsync(loginUser));

export default router;
