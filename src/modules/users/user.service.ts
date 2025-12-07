import bcrypt from 'bcryptjs';
import { pool } from '../../database/DB';
const createUser = async (
  name: string,
  role: string,
  email: string,
  phone: string,
  password: string
) => {
  const hashedPassword = bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users(name,role,email,phone,password) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, role, email, phone, hashedPassword]
  );
  return result;
};
const getUsers = async () => {
  const result = pool.query(`SELECT * FROM users`);
  return result;
};
const deleteUser = async (id: string) => {
  const result = pool.query(
    `SELECT * FROM bookings WHERE user_id=$1 AND status='active'`
  );
  const result1 = pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return { result, result1 };
};
const getExisting = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};
const updateSingleUser = async (
  updated_name: string,
  updated_email: string,
  updated_password: string,
  updated_phone: string,
  updated_role: string,
  id: string
) => {
  const hashedPassword = bcrypt.hash(updated_password, 10);
  const result = await pool.query(
    `
    UPDATE users SET name=$1,email=$2,password=$3,phone=$4,role=$5 WHERE id=$6
    `,
    [
      updated_name,
      updated_email,
      hashedPassword,
      updated_phone,
      updated_role,
      id,
    ]
  );
  return result;
};
export const userServices = {
  createUser,
  getUsers,
  deleteUser,
  getExisting,
  updateSingleUser,
};
