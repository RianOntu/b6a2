import { Request, Response } from 'express';
import { bookingServices } from './booking.service';

const getBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role === 'admin') {
      const result = await bookingServices.getAllBookings();

      return res.status(200).json({
        success: true,
        message: 'All bookings fetched successfully',
        data: result,
      });
    }

    const result = await bookingServices.getBookingsByUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'User bookings fetched successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const bookVehicle = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Rent end date should be after rent start date',
      });
    }

    const vehicleResult = await bookingServices.getVehicle(vehicle_id);
    const vehicle = vehicleResult.rows[0];

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    if (vehicle.availability_status === 'booked') {
      return res.status(400).json({
        success: false,
        message: 'This vehicle is already booked',
      });
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const total_price = days * Number(vehicle.daily_rent_price);
    const status = 'active';

    const result = await bookingServices.bookVehicle(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    );

    const booking = result.rows[0];

    await bookingServices.updateVehicleStatus(vehicle_id, 'booked');

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: booking.id,
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const user = req.user;
    const { status } = req.body;

    const bookingRes = await bookingServices.getBookingById(
      bookingId as string
    );
    const booking = bookingRes.rows[0];

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const now = new Date();

    if (now > new Date(booking.rent_end_date) && booking.status === 'active') {
      await bookingServices.updateBookingStatus(
        bookingId as string,
        'returned'
      );
      await bookingServices.updateVehicleStatus(
        booking.vehicle_id,
        'available'
      );

      return res.status(200).json({
        success: true,
        message: 'Booking auto-returned by system',
      });
    }

    if (user?.role === 'customer') {
      if (user.id !== booking.customer_id) {
        return res.status(403).json({
          success: false,
          message: 'You can only cancel your own booking',
        });
      }

      if (now >= new Date(booking.rent_start_date)) {
        return res.status(400).json({
          success: false,
          message: 'You cannot cancel after the start date',
        });
      }

      if (status !== 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Customers can only cancel bookings',
        });
      }

      await bookingServices.updateBookingStatus(
        bookingId as string,
        'cancelled'
      );
      await bookingServices.updateVehicleStatus(
        booking.vehicle_id,
        'available'
      );

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
      });
    }

    if (user?.role === 'admin') {
      if (status !== 'returned') {
        return res.status(400).json({
          success: false,
          message: 'Admin can only mark booking as returned',
        });
      }

      await bookingServices.updateBookingStatus(
        bookingId as string,
        'returned'
      );
      await bookingServices.updateVehicleStatus(
        booking.vehicle_id,
        'available'
      );

      return res.status(200).json({
        success: true,
        message: 'Booking marked as returned',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Unauthorized action',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  getBookings,
  bookVehicle,
  updateBookingStatus,
};
