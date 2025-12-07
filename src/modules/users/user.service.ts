import bcrypt from 'bcryptjs';
import { pool } from '../../database/DB';
const createUser = async (
  name: string,
  role: string,
  email: string,
  phone: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
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
  console.log(id);

  const exists = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [id]
  );

  let deletedUser = null;

  if (activeBookings.rows.length === 0) {
    deletedUser = await pool.query(
      `DELETE FROM users WHERE id=$1 RETURNING *`,
      [id]
    );
  }

  return { exists, activeBookings, deletedUser };
};
const getExisting = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};
const updateSingleUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
  id: string
) => {
  return await pool.query(
    `
      UPDATE users 
      SET name=$1, email=$2, password=$3, phone=$4, role=$5
      WHERE id=$6
      RETURNING *
    `,
    [name, email, password, phone, role, id]
  );
};
export const userServices = {
  createUser,
  getUsers,
  deleteUser,
  getExisting,
  updateSingleUser,
};
