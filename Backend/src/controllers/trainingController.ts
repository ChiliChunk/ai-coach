import { Request, Response } from 'express';
import geminiService from '../services/geminiService';
import stravaService from '../services/stravaService';
import { getValidAccessToken } from './stravaController';

export const generateTrainingPlan = async (req: Request, res: Response) => {
  try {
    const { course_label, course_type, course_km, course_elevation, frequency, duration, user_presentation, userId } = req.body;

    if (!course_label || !course_type || !course_km || !course_elevation || !frequency || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: course_label, course_type, course_km, course_elevation, frequency, duration',
      });
    }

    const activities = await stravaService.getFilteredStravaActivities(userId, getValidAccessToken);
    const trainingPlan = await geminiService.generateTrainingPlan({
      course_label,
      course_type,
      course_km,
      course_elevation,
      frequency,
      duration,
      user_presentation,
      activities,
    });

    return res.status(200).json({
      success: true,
      data: trainingPlan,
    });
  } catch (error) {
    console.error('Error in generateTrainingPlan controller:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate training plan',
    });
  }
};

export const getMockTrainingPlan = async (req: Request, res: Response) => {
  try {
    const { course_label, course_type, course_km, course_elevation, frequency, duration, user_presentation, userId } = req.body;
    console.log(req.body)
    if (!course_label || !course_type || !course_km || !course_elevation || !frequency || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: course_label, course_type, course_km, course_elevation, frequency, duration',
      });
    }
    const filteredActivities = await stravaService.getFilteredStravaActivities(userId, getValidAccessToken);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const trainingPlan = await geminiService.generateTrainingPlanMock({
      course_label,
      course_type,
      course_km,
      course_elevation,
      frequency,
      duration,
      user_presentation,
      activities: filteredActivities,
    });

    return res.status(200).json({
      success: true,
      data: trainingPlan,
    });
  } catch (error) {
    console.error('Error in getMockTrainingPlan controller:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get mock training plan',
    });
  }
};
