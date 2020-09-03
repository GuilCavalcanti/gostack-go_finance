import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import upload from '../config/upload';

interface Request {
  fileName: string;
}

class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const cvsFilePath = path.join(upload.directory, fileName);
    const createTransaction = new CreateTransactionService();
    const readCSVStream = fs.createReadStream(cvsFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', (line: string) => lines.push(line));

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions: Transaction[] = [];

    for (const transaction of lines) {
      const newTrasaction = await createTransaction.execute({
        title: transaction[0],
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        type: <'income' | 'outcome'>transaction[1],
        value: Number(transaction[2]),
        category: transaction[3],
      });
      transactions.push(newTrasaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
