import express from "express";
const router = express.Router();
import * as userControllers from '../controllers/user.js';
import wrapAsync from '../middlewares/wrapAsync.js';
import { authorization } from '../middlewares/authorization.js';


router.get("/profile", authorization, wrapAsync(userControllers.getAuthUser));
router.get("/users", authorization, wrapAsync(userControllers.getAllUsers));

export default router;
