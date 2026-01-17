import { Router } from 'express';
import * as Auth from './controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.post('/auth/register', Auth.register);
router.post('/auth/login', Auth.login);
router.get('/auth/me', requireAuth, Auth.me);

export default router;
