import { Request, Response } from 'express';
import { userServices } from './user.service';
import bcrypt from 'bcryptjs';

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
  try {
    const { exists, activeBookings, deletedUser } =
      await userServices.deleteUser(req.params.userId as string);

    if (exists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user: Active bookings exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser?.rows[0],
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
  const { userId } = req.params;

 
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized",
    });
  }

  
  const existing = await userServices.getExisting(userId as string);

  if (existing.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const olduser = existing.rows[0];

  
  const updated_name = name ?? olduser.name;
  const updated_email = email ?? olduser.email;
  const updated_phone = phone ?? olduser.phone;
  const updated_role = role ?? olduser.role;

  
  let updated_password = olduser.password;

  if (password) {
    updated_password = await bcrypt.hash(password, 10);
  }


  const result = await userServices.updateSingleUser(
    updated_name,
    updated_email,
    updated_password,
    updated_phone,
    updated_role,
    userId!
  );

  res.status(200).json({
    success: true,
    message: "User Updated",
    data: result.rows[0],
  });
};

export const userController = {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
};
