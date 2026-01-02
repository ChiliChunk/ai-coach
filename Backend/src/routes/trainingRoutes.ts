import { Router } from 'express';
import { generateTrainingPlan } from '../controllers/trainingController';

const router = Router();

router.post('/generate', generateTrainingPlan);

export default router;
