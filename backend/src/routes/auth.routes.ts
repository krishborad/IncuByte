import { Router, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../validators/auth.validator';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected user route
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// Protected admin-only route
router.get('/admin-only', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Admin!',
    data: {
      user: req.user,
    },
  });
});

export default router;
