import { Kafka } from 'kafkajs';

const kakfa = new Kafka({
  clientId: 'anti-fraud-service',
  brokers: ['localhost:9092'],
});

const consumer = kakfa.consumer({ groupId: 'anti-fraud-group' });
const producer = kakfa.producer();

export async function starConsumer() {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: 'transaction.created' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      console.log('Received transaction: ', data);

      const status = data.value > 1000 ? 'rejected' : 'approved';

      // send result
      await producer.send({
        topic: 'transaction.validated',
        messages: [
          {
            value: JSON.stringify({
              transactionId: data.transactionId,
              status,
            }),
          },
        ],
      });
    },
  });
}
