import express from "express";
import { toRegister, authenticate, confirmUser, lostPassword, checkToken, newPassword, profile } from "../controllers/userController.js";
import checkAuthorization from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/', toRegister);
router.post('/login', authenticate);
router.get('/confirm/:token', confirmUser);
router.post('/forgot-password', lostPassword);
router.route('/forgot-password/:token').get(checkToken).post(newPassword);
router.get('/profile', checkAuthorization, profile)


export default router;
