import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: ['localhost:9092'],
});
