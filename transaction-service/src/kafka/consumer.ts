import { PrismaClient } from '@prisma/client';
import { kafka } from './kafka.client';

const consumer = kafka.consumer({ groupId: 'transaction-group' });
const prisma = new PrismaClient();

export async function startConsumer() {
  await consumer.connect();

  await consumer.subscribe({ topic: 'transaction.validated' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      console.log('Validation received: ', data);

      await prisma.transaction.update({
        where: { id: data.transactionId },
        data: { status: data.status },
      });
    },
  });
}
