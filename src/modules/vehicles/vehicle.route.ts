import { Router } from 'express';
import auth from '../../middleware/auth';
import { vehicleConroller } from './vehicle.controller';

const router = Router();

router.post('/', auth('admin'), vehicleConroller.createVehicle);
router.get('/', vehicleConroller.getVehicles);
router.get('/:vehicleId', vehicleConroller.getSingleVehicle);
router.put('/:vehicleId', auth('admin'), vehicleConroller.updateSingleVehicle);
router.delete('/:vehicleId', auth('admin'), vehicleConroller.deleteVehicle);

export const vehicleRoutes = router;
