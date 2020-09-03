import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepo = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepo.find();

    const balance = transactions.reduce(
      (accumulator: Balance, transaction: Transaction): Balance => {
        accumulator[transaction.type] += Number(transaction.value);
        accumulator.total +=
          transaction.type === 'income'
            ? Number(transaction.value)
            : Number(-transaction.value);

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    // console.log(balance);
    return balance;
  }
}

export default TransactionsRepository;
