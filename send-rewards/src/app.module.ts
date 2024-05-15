import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './models/Account.model';
import { Award, AwardSchema } from './models/Award.model';
import { Currency, CurrencySchema } from './models/Currency.model';
import { Setting, SettingSchema } from './models/Setting.model';
import { Transaction, TransactionSchema } from './models/Transaction.model';
import { TransactionModule } from './Transaction/transaction.module'
import { TransactionSchedulerService } from './schedule/scheduleFetchTransactions';
import { TransferModule } from './transfer/transfer.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        dbName: "cta"
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }, { name: Award.name, schema: AwardSchema },  { name: Currency.name, schema: CurrencySchema }, { name: Setting.name, schema: SettingSchema }, { name: Transaction.name, schema: TransactionSchema }]),
    TransactionModule,
    TransferModule
  ],
  controllers: [AppController],
  providers: [AppService, TransactionSchedulerService],
})
export class AppModule {}
