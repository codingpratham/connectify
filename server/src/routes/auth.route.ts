const router = require('express').Router();
import { createAccount, login, logout} from '../controller/auth.controller';
import { onBoard } from '../controller/onboarding.controller';
import { protectRoute } from '../middleware/auth.middleware';

router.post('/register', createAccount);
router.post('/login', login)
router.get('/logout', logout)
router.post('/onboard', protectRoute, onBoard)

export default router;