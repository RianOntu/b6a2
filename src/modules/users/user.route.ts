import { Router } from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';
import { authController } from '../auth/auth.controller';

const router = Router();

router.post('/signup', userController.createUser);
router.post('/signin', authController.loginUser);
router.get('/', auth('admin'), userController.getUsers);
router.delete('/:userId', auth('admin'), userController.deleteUser);
router.put('/:userId', auth('admin', 'customer'), userController.updateUser);

export const userRoutes = router;
