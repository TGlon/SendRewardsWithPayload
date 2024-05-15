import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { Transaction, TransactionSchema } from '../models/Transaction.model';
import { Account, AccountSchema } from '../models/Account.model';
import { Award, AwardSchema } from '../models/Award.model';
import { Setting, SettingSchema } from '../models/Setting.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Currency, CurrencySchema } from 'src/models/Currency.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: Currency.name, schema: CurrencySchema },
    ]),
  ],
  controllers: [TransferController],
  providers: [TransferService]
})
export class TransferModule {}
