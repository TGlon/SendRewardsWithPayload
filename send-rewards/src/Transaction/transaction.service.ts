import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../models/Transaction.model';
import { Account } from '../models/Account.model';
import { Award } from '../models/Award.model';
import { Setting } from '../models/Setting.model';
const { ObjectId } = require('mongodb');
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private readonly transactionModel: Model<Transaction>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('Award') private readonly awardModel: Model<Award>,
    @InjectModel('Setting') private readonly settingModel: Model<Setting>,
  ) { }

  private async convertToUnixTimestamp(dateTime: string): Promise<number> {
    const date = new Date(dateTime);
    return Math.floor(date.getTime() / 1000);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private currentDate: Date;
  async getAllTransactionItems(): Promise<any> {

    try {
      // if (!this.currentDate) {
      //   const time = await this.settingModel.findOne();
      //   if (!time || !time.StartTime) {
      //     throw new HttpException('Configuration error: StartTime not set', HttpStatus.INTERNAL_SERVER_ERROR);
      //   }
      //   this.currentDate = new Date(String(time.StartTime));
      // }
      if (!this.currentDate) {
        const time = await this.settingModel.findOne();
        if (!time || !time.StartTime) {
          this.currentDate = new Date();
          this.currentDate.setHours(0, 0, 0, 0); // Set current date to today's date
        } else {
          this.currentDate = new Date(String(time.StartTime));
        }
      }
      console.log("Current Date: ", this.currentDate);

      const accounts = await this.accountModel.find();
      if (!accounts || accounts.length === 0) {
        throw new HttpException('No accounts found', HttpStatus.NOT_FOUND);
      }

      const transactionsPromises = accounts.map(async (account, index) => {
        await this.delay(3500 * index);
        const apiUrl = `https://testnet.tonapi.io/v2/blockchain/accounts/${account.WalletAddress}/transactions`;
        try {
          console.log("apiURL:", apiUrl);
          const response = await axios.get(apiUrl);
          console.log("Response:", response.data);
          const startTimestamp = await this.convertToUnixTimestamp(this.currentDate.toISOString());
          
          const endOfDay = new Date(this.currentDate);
          endOfDay.setHours(23, 59, 59, 999);
          console.log("endTime:", endOfDay);
          
          const endTimestamp = await this.convertToUnixTimestamp(endOfDay.toISOString());
          console.log("endTimestamp", endTimestamp);
          
          const filteredTransactions = response.data.transactions.filter((transaction) => {
            const utime = transaction.utime;
            return utime >= startTimestamp && utime <= endTimestamp;
          });
          if (filteredTransactions.length === 0) {
            console.log(`Account ${account.WalletAddress} has no transactions within the specified time range.`);
          } else {
            console.log(`Filtered transactions for account ${account.WalletAddress}`);
          }

          for (const transaction of filteredTransactions) {
            const existingTransaction = await this.transactionModel.findOne({ hash: transaction.hash });
            if (!existingTransaction) {
              const newTransaction = new this.transactionModel(transaction);
              await newTransaction.save();
            }
          }

          const totalFee = filteredTransactions.reduce((sum, transaction) => {
            return sum + (transaction.total_fees || 0);
          }, 0);

          const awards = await this.awardModel.find();
          let highestAward = null;
          awards.forEach((award) => {
            if (parseInt(totalFee) >= parseInt(award.totalFee)) {
              if (!highestAward || parseInt(award.totalFee) > parseInt(highestAward.totalFee)) {
                highestAward = award;
              }
            }
          });

          if (highestAward) {
            console.log(`Account ${account.WalletAddress} has earned an award`);
            console.log(highestAward);
            await this.accountModel.updateOne(
              { WalletAddress: account.WalletAddress },
              {
                $push: {
                  awards: {
                    awardId: highestAward._id,
                    claimed: false,
                    create_at: new Date(),
                    _id: new ObjectId()
                  },
                },
              }
            );
          }

          return {
            walletAddress: account.WalletAddress,
            totalFee: totalFee,
            transactions: {
              transactions: filteredTransactions,
            },
          };
        } catch (error) {
          return {
            walletAddress: account.WalletAddress,
            error: error.response ? error.response.statusText : error.message,
          };
        }
      });

      const results = await Promise.allSettled(transactionsPromises);

      const filteredResults = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<any>).value); // Add type assertion here

      this.currentDate.setDate(this.currentDate.getDate() + 1);

      return filteredResults;

    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new HttpException('Error processing request: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
