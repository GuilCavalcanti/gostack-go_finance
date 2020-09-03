import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class GetTransactionService {
  public async execute(): Promise<Transaction[]> {
    const allTransactions: Transaction[] = [];
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const categoryRepo = getRepository(Category);
    const transactions = await transactionRepo.find();

    for (const transaction of transactions) {
      const category = await categoryRepo.findOne(transaction.category_id)!;
      delete transaction.category_id;
      transaction.category = category!;
      allTransactions.push(transaction);
    }
    return allTransactions;
  }
}

export default GetTransactionService;
