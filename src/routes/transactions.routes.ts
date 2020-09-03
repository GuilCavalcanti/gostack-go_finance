import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';
import GetTransactionService from '../services/GetTransactionsService';
import Category from '../models/Category';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const getTransactions = new GetTransactionService();
  const transactionRepo = getCustomRepository(TransactionsRepository);
  const balance = await transactionRepo.getBalance();
  const transactions = await getTransactions.execute();

  const categoriesRepo = getRepository(Category);
  const category = await categoriesRepo.find();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionID: string = id;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(transactionID);
  return response.json({ ok: true });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const transactionsImportated = new ImportTransactionsService();
    const transactions: Transaction[] = await transactionsImportated.execute({
      fileName: request.file.filename,
    });
    return response.json(transactions);
  },
);

export default transactionsRouter;
