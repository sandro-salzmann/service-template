import { flaschenpost } from 'flaschenpost';
import { Bus } from 'simple-amqp-client';
import { CONFIG } from '../config';
import { makeServiceBus } from './service-bus';

const logger = flaschenpost.getLogger();

const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST, SERVICE_NAME } = CONFIG;

const bus = new Bus(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:5672`, SERVICE_NAME);

export const initBus = async () => {
  await bus.connect();
  logger.info('Connected successfully to bus.');
};

export const closeBus = async () => {
  await bus.close();
};

export type MakeBusFn = () => Bus;

const makeBus: MakeBusFn = () => bus;

export const serviceBus = makeServiceBus({ makeBus });
