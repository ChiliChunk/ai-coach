import { Request, Response } from 'express';
import geminiService from '../services/geminiService';
import fs from 'fs';
import path from 'path';

export const generateTrainingPlan = async (req: Request, res: Response) => {
  try {
    const { course_label, course_type, course_km, course_elevation, frequency, duration } = req.body;

    if (!course_label || !course_type || !course_km || !course_elevation || !frequency || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: course_label, course_type, course_km, course_elevation, frequency, duration',
      });
    }

    const trainingPlan = await geminiService.generateTrainingPlan({
      course_label,
      course_type,
      course_km,
      course_elevation,
      frequency,
      duration,
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
    const { course_label, course_type, course_km, course_elevation, frequency, duration } = req.body;

    if (!course_label || !course_type || !course_km || !course_elevation || !frequency || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: course_label, course_type, course_km, course_elevation, frequency, duration',
      });
    }

    console.log('Mock plan requested with data:', { course_label, course_type, course_km, course_elevation, frequency, duration });

    const mockDataPath = path.join(__dirname, '../mock/gemini_answer.json');
    const mockData = fs.readFileSync(mockDataPath, 'utf-8');
    const trainingPlan = JSON.parse(mockData);

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
