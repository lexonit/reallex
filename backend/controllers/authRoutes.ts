import express from 'express';
import { login, registerVendor, refreshToken, logout } from '../controllers/authController';

const router = express.Router();

router.post('/register-vendor', registerVendor);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;