import express, { Request, Response } from 'express';
import { initDB } from './database/DB';
import { userRoutes } from './modules/users/user.route';
import { vehicleRoutes } from './modules/vehicles/vehicle.route';
import config from './config';
import { bookingRoutes } from './modules/bookings/booking.route';

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.use('/api/v1/auth', userRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/users', userRoutes);

app.use('/api/v1/vehicles', vehicleRoutes);

app.use('/api/v1/bookings', bookingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'route not found',
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
