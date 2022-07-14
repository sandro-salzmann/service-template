import 'dotenv/config';
import { flaschenpost } from 'flaschenpost';
import Joi from 'joi';

const logger = flaschenpost.getLogger();

interface EnvVarsSchema {
  // general
  SERVICE_NAME: string;

  // logging
  LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug';
  LOG_FORMATTER: 'human' | 'json';

  // express
  EXPRESS_PORT: number;
  ALLOWED_CORS_ORIGIN: string;

  // mongo db
  MONGO_HOST: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_DATABASE: string;

  // rabbitmq bus
  RABBITMQ_HOST: string;
  RABBITMQ_USERNAME: string;
  RABBITMQ_PASSWORD: string;
}

const envVarsSchemaValidator = Joi.object<EnvVarsSchema>()
  .keys({
    // general
    SERVICE_NAME: Joi.string().required(),

    // logging
    LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug').required(),
    LOG_FORMATTER: Joi.string().valid('human', 'json').required(),

    // express
    EXPRESS_PORT: Joi.number().required(),
    ALLOWED_CORS_ORIGIN: Joi.string().required(),

    // mongo db
    MONGO_HOST: Joi.string().required(),
    MONGO_USERNAME: Joi.string().required(),
    MONGO_PASSWORD: Joi.string().required(),
    MONGO_DATABASE: Joi.string().required(),

    // rabbitmq bus
    RABBITMQ_HOST: Joi.string().required(),
    RABBITMQ_USERNAME: Joi.string().required(),
    RABBITMQ_PASSWORD: Joi.string().required(),
  })
  .unknown(true)
  .required();

const { value: validEnvVars, error } = envVarsSchemaValidator.validate(process.env);

if (error) {
  logger.error('There is an error with the environment variables.', { ...error.details });
  process.exit(1);
}

if (!validEnvVars) {
  logger.error('There is an unknown error with the environment variables.');
  process.exit(1);
}

export const CONFIG = validEnvVars;
