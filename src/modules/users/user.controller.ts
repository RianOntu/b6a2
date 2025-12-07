import { Request, Response } from 'express';
import { userServices } from './user.service';

const createUser = async (req: Request, res: Response) => {
  const { name, role, email, phone, password } = req.body;
  try {
    const result = await userServices.createUser(
      name,
      role,
      email,
      phone,
      password
    );
    res.status(201).json({
      success: true,
      message: 'User created',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  const users = (await userServices.getUsers()).rows;
  res.status(200).json({
    success: true,
    message: 'All users fetched',
    data: users,
  });
};
const deleteUser = async (req: Request, res: Response) => {
  const obj = await userServices.deleteUser(req.params.id as string);
  const { result, result1 } = obj as any;

  try {
    if (result.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user: Active bookings exist',
      });
    }

    if (result1.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: result1.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized',
    });
  }
  const existing = await userServices.getExisting(id as string);

  if (existing.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  const olduser = existing.rows[0];

  const updated_name = name ?? olduser.name;
  const updated_email = email ?? olduser.email;
  const updated_password = password ?? olduser.password;
  const updated_phone = phone ?? olduser.phone;
  const updated_role = role ?? olduser.role;

  const result = (await userServices.updateSingleUser(
    updated_name,
    updated_email,
    updated_password,
    updated_phone,
    updated_role,
    id!
  )) as any;

  res.status(200).json({
    success: true,
    message: 'User Updated',
    data: result.rows[0],
  });
};

export const userController = {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
};
