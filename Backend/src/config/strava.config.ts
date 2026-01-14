import dotenv from 'dotenv';

dotenv.config();

interface StravaConfig {
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  revokeEndpoint: string;
  apiBaseUrl: string;
  scopes: string[];
}

const stravaConfig: StravaConfig = {
  clientId: process.env.STRAVA_CLIENT_ID || '',
  clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revokeEndpoint: 'https://www.strava.com/oauth/deauthorize',
  apiBaseUrl: 'https://www.strava.com/api/v3',
  scopes: ['activity:read_all'],
};

// Validation des variables d'environnement
if (!stravaConfig.clientId || !stravaConfig.clientSecret) {
  console.warn('STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET must be set in environment variables');
}

export default stravaConfig;
