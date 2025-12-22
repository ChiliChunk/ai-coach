import { Router } from 'express';
import * as stravaController from '../controllers/stravaController';

const router = Router();

// Configuration publique
router.get('/config', stravaController.getConfig);

// Authentification
router.post('/auth/exchange', stravaController.exchangeToken);
router.post('/auth/refresh', stravaController.refreshToken);
router.get('/auth/check', stravaController.checkAuth);
router.post('/auth/logout', stravaController.logout);

// Données utilisateur
router.get('/athlete', stravaController.getAthlete);
router.get('/activities', stravaController.getActivities);
router.get('/activities/:activityId', stravaController.getActivity);

export default router;
