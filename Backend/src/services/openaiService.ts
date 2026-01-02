import OpenAI from 'openai';
import config from '../config/config';
import fs from 'fs';
import path from 'path';

interface TrainingPlanInput {
  course_label: string;
  course_type: string;
  frequency: string;
  duration: string;
}

interface TrainingSession {
  session_number: number;
  title: string;
  type: 'endurance' | 'fractionné' | 'sortie_longue' | 'récupération' | 'tempo';
  duration_minutes: number;
  distance_km?: number;
  intensity: 'faible' | 'modérée' | 'élevée';
  description: string;
  exercises: Array<{
    name: string;
    details: string;
  }>;
  tips: string[];
}

interface TrainingWeek {
  week_number: number;
  phase: 'préparation' | 'développement' | 'affûtage';
  focus: string;
  sessions: TrainingSession[];
}

interface TrainingPlanResponse {
  plan_overview: {
    total_weeks: number;
    sessions_per_week: number;
    course_type: string;
    objective: string;
  };
  weeks: TrainingWeek[];
  general_recommendations: string[];
}

class OpenAIService {
  private client: OpenAI;
  private systemPrompt: string;
  private userPromptTemplate: string;

  constructor() {
    if (!config.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    this.client = new OpenAI({
      apiKey: config.openaiApiKey,
    });

    this.systemPrompt = fs.readFileSync(
      path.join(__dirname, '../prompts/training-plan-system.txt'),
      'utf-8'
    );

    this.userPromptTemplate = fs.readFileSync(
      path.join(__dirname, '../prompts/training-plan-user.txt'),
      'utf-8'
    );
  }

  private generateUserPrompt(planData: TrainingPlanInput): string {
    const courseTypeLabel = planData.course_type === 'road_running' ? 'course sur route' : 'trail';

    return this.userPromptTemplate
      .replace(/\{\{course_label\}\}/g, planData.course_label)
      .replace(/\{\{course_type\}\}/g, courseTypeLabel)
      .replace(/\{\{frequency\}\}/g, planData.frequency)
      .replace(/\{\{duration\}\}/g, planData.duration)
      .replace(/\{\{course_type_value\}\}/g, planData.course_type);
  }

  async generateTrainingPlan(planData: TrainingPlanInput): Promise<TrainingPlanResponse> {
    try {
      const userPrompt = this.generateUserPrompt(planData);

      const completion = await this.client.chat.completions.create({
        model: 'gpt-5.2-pro',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const trainingPlan: TrainingPlanResponse = JSON.parse(content);

      return trainingPlan;
    } catch (error) {
      console.error('Error generating training plan:', error);
      throw new Error('Failed to generate training plan');
    }
  }
}

export default new OpenAIService();
