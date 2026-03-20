import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { producer } from 'src/kafka/producer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto) {
    const transactionId = randomUUID();

    const transaction = await this.prisma.transaction.create({
      data: {
        id: transactionId,
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        tranferTypeId: dto.tranferTypeId,
        value: dto.value,
        status: 'pending',
      },
    });

    await producer.send({
      topic: 'transaction.created',
      messages: [
        {
          value: JSON.stringify({
            transactionId,
            accountExternalIdDebit: dto.accountExternalIdDebit,
            accountExternalIdCredit: dto.accountExternalIdCredit,
            value: dto.value,
          }),
        },
      ],
    });

    return transaction;
  }

  async getById(id: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
    });

    return {
      transactionExternalId: tx.id,
      transactionType: {
        name: 'transfer',
      },
      transactionStatus: {
        name: tx.status,
      },
      value: tx.value,
      createdAt: tx.createdAt,
    };
  }
}
