import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAllTransactions() {
    try {
      const transactions = await this.transactionService.getAllTransactionItems();
      return transactions;
    } catch (error) {
      throw new HttpException('Error fetching transactions: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
