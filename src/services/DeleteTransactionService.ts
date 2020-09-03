import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    transactionRepo.delete({ id });
  }
}

export default DeleteTransactionService;
