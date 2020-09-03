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

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepo = getRepository(Category);
    let checkCategoryExists = await categoryRepo.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      checkCategoryExists = categoryRepo.create({ title: category });
      await categoryRepo.save(checkCategoryExists);
    }

    const transactionsRepo = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepo.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Not enough funds on the account', 400);
    }

    const transaction = transactionsRepo.create({
      title,
      type,
      value,
      category_id: checkCategoryExists.id,
    });

    await transactionsRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
