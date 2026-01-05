import { Router } from 'express';
import { generateTrainingPlan, getMockTrainingPlan } from '../controllers/trainingController';

const router = Router();

router.post('/generate', generateTrainingPlan);
router.post('/mock', getMockTrainingPlan);

export default router;
