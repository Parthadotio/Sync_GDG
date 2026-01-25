import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';


const router = Router();


router.post('/register',
    body('userName').notEmpty().withMessage('Enter a user name'),
    body('email').isEmail().withMessage('Email must be a valid Email'),
    body('password').isLength({ min : 3 }).withMessage('Password must atleast 3 character long'),
    userController.createUserController);

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min : 3 }).withMessage('Password must be at least 3 character long'),
    userController.loginController
);


router.get('/profile', authMiddleware.authUser, userController.profileController);


router.get('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all', authMiddleware.authUser, userController.getAllUsersController);


export default router;
