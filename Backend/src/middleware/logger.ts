import morgan from 'morgan';
import config from '../config/config';

const logger = morgan(config.nodeEnv === 'production' ? 'combined' : 'dev');

export default logger;
