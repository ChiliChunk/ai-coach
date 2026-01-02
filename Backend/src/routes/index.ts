import { Router } from 'express';
import healthRoutes from './healthRoutes';
import stravaRoutes from './stravaRoutes';
import trainingRoutes from './trainingRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/strava', stravaRoutes);
router.use('/training', trainingRoutes);

export default router;
