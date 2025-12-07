import bcrypt from 'bcryptjs';
import { pool } from '../../database/DB';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (eamil: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    eamil,
  ]);
  const user = result.rows[0];
  if (result.rows.length === 0) {
    return null;
  }
  const match = bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const secret = config.jwt_secret;
  const token = jwt.sign(payload, secret as string, {
    expiresIn: '7d',
  });
  return { token, user };
};

export const authServices = {
  loginUser,
};
