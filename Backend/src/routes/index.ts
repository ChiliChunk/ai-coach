import { Router } from 'express';
import healthRoutes from './healthRoutes';
import stravaRoutes from './stravaRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/strava', stravaRoutes);

export default router;
