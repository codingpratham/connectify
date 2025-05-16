const router = require('express').Router();
import { createAccount, login, logout, onBoard } from '../controller/auth.controller';
import { protectRoute } from '../middleware/auth';
import { upload } from '../middleware/upload';

router.post('/register', createAccount);
router.post('/login', login)
router.get('/logout', logout)
router.post('/onboard', protectRoute, upload.single('avatar'), onBoard)

export default router;