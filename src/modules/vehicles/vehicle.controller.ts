import { Request, Response } from 'express';
import { vehicleServices } from './vehicle.service';


const createVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  try {
    const result = await vehicleServices.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    res.status(201).json({
      success: true,
      message: 'Vehicle created',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  const vehicles = (await vehicleServices.getVehicles()).rows;
  res.status(200).json({
    success: true,
    message: 'All vehicles fetched',
    data: vehicles,
  });
};
const getSingleVehicle = async (req: Request, res: Response) => {
  const singleVehicle = await vehicleServices.getSingleVehicle(
    req.params.vehicleId as string
  );
  if (singleVehicle.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: `Vehicle not found`,
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'Vehicle found',
      data: singleVehicle.rows[0],
    });
  }
};
const updateSingleVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  const { vehicleId } = req.params;
  const existing = await vehicleServices.getExisting(vehicleId as string);

  if (existing.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found',
    });
  }

  const oldVehicle = existing.rows[0];

  const updated_vehicle_name = vehicle_name ?? oldVehicle.vehicle_name;
  const updated_type = type ?? oldVehicle.type;
  const updated_registration_number =
    registration_number ?? oldVehicle.registration_number;
  const updated_daily_rent_price =
    daily_rent_price ?? oldVehicle.daily_rent_price;
  const updated_availability_status =
    availability_status ?? oldVehicle.availability_status;

  const result = await vehicleServices.updateSingleVehicle(
    updated_vehicle_name,
    updated_type,
    updated_registration_number,
    updated_daily_rent_price,
    updated_availability_status,
    vehicleId!
  );

  res.status(200).json({
    success: true,
    message: 'Vehicle Updated',
    data: result.rows[0],
  });
};

const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const obj = (await vehicleServices.deleteVehicle(vehicleId as string)) as any;
  const { result, result1 } = obj;

  try {
    if (result.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle: Active bookings exist',
      });
    }

    if (result1.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: result1.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const vehicleConroller = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateSingleVehicle,
  deleteVehicle,
};
