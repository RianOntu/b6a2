import { Request, Response } from 'express';
import { authServices } from './auth.service';

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'User Logged in',
      data: result,
    });
  } catch (err: any) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  loginUser,
};
