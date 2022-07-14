import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { flaschenpost, getMiddleware as getLoggingMiddleware } from 'flaschenpost';
import { Server } from 'http';
import { onShutdown } from 'node-graceful-shutdown';
import { closeBus, initBus, serviceBus } from './bus-access';
import { CONFIG } from './config';
import { closeDb, initDb } from './data-access';
import { handleExpressRequest } from './express-request-handler';
import { getDocument } from './http-controller';
import { handleSomeEvent, handleSomeOtherCall, handleXyzDeletion, handleXyzUpdate } from './use-cases';

dotenv.config();

const { EXPRESS_PORT, ALLOWED_CORS_ORIGIN, SERVICE_NAME } = CONFIG;

flaschenpost.configure(
  flaschenpost
    .getConfiguration()
    .withApplication({ name: SERVICE_NAME, version: process.env.npm_package_version || 'version unknown' }),
);

const logger = flaschenpost.getLogger();

let httpServer: Server;

const main = async () => {
  logger.info('Starting service...');
  try {
    await initDb();
  } catch (error) {
    logger.error('Failed to init db.', { error });
    throw error;
  }
  try {
    await initBus();
  } catch (error) {
    logger.error('Failed to init bus.', { error });
    throw error;
  }

  const app = express();

  // Log requests
  app.use(getLoggingMiddleware());

  // Allow cors origins
  const corsOptions = { origin: ALLOWED_CORS_ORIGIN, optionsSuccessStatus: 200 };
  app.use(cors(corsOptions));

  // Parse JSON request body
  app.use(bodyParser.json());

  // HTTP routes controllers
  app.get('/:_id', handleExpressRequest(getDocument));

  // Bus messaging controllers
  await serviceBus.subscribeXyzUpdates(handleXyzUpdate);
  await serviceBus.subscribeXyzDeletions(handleXyzDeletion);
  await serviceBus.answerSomeOtherCall(handleSomeOtherCall);
  await serviceBus.subscribeSomeEvent(handleSomeEvent);

  httpServer = app.listen(EXPRESS_PORT, () => logger.info(`Started service at localhost:${EXPRESS_PORT}`));
};

onShutdown(async () => {
  logger.warn('Shutting down instance...');

  try {
    await Promise.all([closeDb, closeBus, httpServer?.close]);
  } catch (error) {
    logger.error('An error occured while cleaning up connections: ', { error });
  }

  logger.warn('Shut down instance.');
});

main()
  .then(() => logger.info('Started service successfully.'))
  .catch((error) => logger.error('An error occured while starting the service.', { error }));
