import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionSchema } from '../models/Transaction.model';
import { Account, AccountSchema } from '../models/Account.model';
import { Award, AwardSchema } from '../models/Award.model';
import { Setting, SettingSchema } from '../models/Setting.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
