import { pool } from '../../database/DB';

const getAllBookings = async () => {
  const result = await pool.query(`
    SELECT 
      b.*,
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
  `);

  return result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
};

const getBookingsByUser = async (id: string) => {
  const result = await pool.query(
    `
    SELECT 
      b.*,
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
  `,
    [id]
  );

  return result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
};
const getVehicle = async (id: string) => {
  const result = pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};
const bookVehicle = async (
  customer_id: string,
  vehicle_id: string,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number,
  status: string
) => {
  const result = await pool.query(
    `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );
  return result;
};
const updateBookingStatus = (id: string, status: string) => {
  return pool.query(`UPDATE bookings SET status=$1 WHERE id=$2`, [status, id]);
};

const updateVehicleStatus = (vehicle_id: number, status: string) => {
  return pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
    [status, vehicle_id]
  );
};
const getBookingById = async (bookingId: string) => {
  return pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
};
export const bookingServices = {
  getAllBookings,
  getBookingsByUser,
  getVehicle,
  bookVehicle,
  updateVehicleStatus,
  updateBookingStatus,
  getBookingById
};
