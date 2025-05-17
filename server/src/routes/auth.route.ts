const router = require('express').Router();
import { createAccount, login, logout} from '../controller/auth.controller';
import { onBoard } from '../controller/onboarding.controller';
import { protectRoute } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload';

router.post('/register', createAccount);
router.post('/login', login)
router.get('/logout', logout)
router.post('/onboard', protectRoute, upload.single('avatar'), onBoard)

export default router;