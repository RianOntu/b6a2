import { Request } from 'express';
import { pool } from '../../database/DB';
const createVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};
const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};
const updateSingleVehicle = async (
  updated_vehicle_name: string,
  updated_type: string,
  updated_registration_number: string,
  updated_daily_rent_price: number,
  updated_availability_status: string,
  id: string
) => {
  const result = pool.query(
    `UPDATE vehicles SET vehicle_name=$1,type=$2,registration_number=$3,daily_rent_price=$4,availability_status=$5 WHERE id=$6`,
    [
      updated_vehicle_name,
      updated_type,
      updated_registration_number,
      updated_daily_rent_price,
      updated_availability_status,
      id,
    ]
  );
  return result;
};
const deleteVehicle = async (vehicleId: string) => {
  const result = await pool.query(
    `SELECT * FROM bookings 
       WHERE vehicle_id = $1 AND status = 'active'`,
    [vehicleId]
  );
  const result1 = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [vehicleId]
  );
  return { result, result1 };
};
const getExisting = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};
export const vehicleServices = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateSingleVehicle,
  deleteVehicle,
  getExisting,
};
