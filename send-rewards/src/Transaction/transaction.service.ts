// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import axios from 'axios';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Transaction } from '../models/Transaction.model';
// import { Account } from '../models/Account.model';
// import { Award } from '../models/Award.model';
// import { Setting } from '../models/Setting.model';
// import * as moment from 'moment-timezone';
// const { ObjectId } = require('mongodb');
// import { ChangeStream } from 'mongodb';
// @Injectable()
// export class TransactionService {
//   constructor(
//     @InjectModel('Transaction') private readonly transactionModel: Model<Transaction>,
//     @InjectModel('Account') private readonly accountModel: Model<Account>,
//     @InjectModel('Award') private readonly awardModel: Model<Award>,
//     @InjectModel('Setting') private readonly settingModel: Model<Setting>,
//   ) { this.initializeChangeStream(); }
//   private initializeChangeStream() {
//     const changeStream: ChangeStream = this.settingModel.watch();

//     changeStream.on('change', async (change) => {
//       console.log('Change detected:', change);
//       if (change.operationType === 'update' || change.operationType === 'replace') {
//         const time = await this.settingModel.findOne();
//         if (time && time.StartTime) {
//           this.currentDate = moment.utc(time.StartTime).toDate();
//         } else {
//           this.currentDate = moment.utc().startOf('day').toDate();
//         }
//         console.log('Updated current date:', this.currentDate);
//       }
//     });

//     changeStream.on('error', (error) => {
//       console.error('Error in change stream:', error);
//     });

//     changeStream.on('close', () => {
//       console.log('Change stream closed');
//     });

//     changeStream.on('end', () => {
//       console.log('Change stream ended');
//     });
//   }
//   // private async convertToUnixTimestamp(dateTime: string): Promise<number> {
//   //   const date = new Date(dateTime);
//   //   return Math.floor(date.getTime() / 1000);
//   // }

//   private async delay(ms: number): Promise<void> {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   private currentDate: Date;
//   async getAllTransactionItems(): Promise<any> {

//     try {
//       if (!this.currentDate) {
//         const time = await this.settingModel.findOne();
//         console.log("time.StartTime", moment(time.StartTime).tz('Asia/Bangkok').format());        
//         // if (!time || !time.StartTime) {
//         //   // No time set, default to now and set to start of the day in UTC+7
//         //   this.currentDate = moment.tz('Asia/Bangkok').startOf('day').toDate();
//         // } else {
//         //   this.currentDate = moment(time.StartTime).tz('Asia/Bangkok').toDate();
//         // }
//         if (!time || !time.StartTime) {
//           // No time set, default to now and set to start of the day in UTC
//           this.currentDate = moment.utc().startOf('day').toDate();
//         } else {
//           this.currentDate = moment(time.StartTime).utc().toDate();
//         }        
//       }
//       console.log("Current Date: ", this.currentDate);

//       const accounts = await this.accountModel.find();
//       if (!accounts || accounts.length === 0) {
//         throw new HttpException('No accounts found', HttpStatus.NOT_FOUND);
//       }

//       const transactionsPromises = accounts.map(async (account, index) => {
//         await this.delay(3500 * index);
//         const apiUrl = `https://testnet.tonapi.io/v2/blockchain/accounts/${account.WalletAddress}/transactions`;
//         try {
//           const response = await axios.get(apiUrl);
//           // const startTimestamp = await this.convertToUnixTimestamp(this.currentDate.toISOString());
//           // const startTimestamp = moment.tz(this.currentDate, "Asia/Bangkok").unix();
//           const startTimestamp = moment.utc(this.currentDate).unix();
//           console.log("startTimestamp", startTimestamp);
//           const hours = await this.settingModel.findOne();
//           // const endOfDay = moment(this.currentDate).endOf('day').add(7, 'hours').toDate();
//           // const endOfDay = moment.tz(this.currentDate, "Asia/Bangkok").add(hours.settime, 'hours').toDate();
//           const endOfDay = moment.utc(this.currentDate).add(hours.settime, 'hours').toDate();
//           console.log("endTime:", endOfDay);

//           // const endTimestamp = await this.convertToUnixTimestamp(endOfDay.toISOString());
//           // const endTimestamp = moment.tz(endOfDay, "Asia/Bangkok").unix();
//           const endTimestamp = moment.utc(endOfDay).unix();
//           console.log("endTimestamp", endTimestamp);
//           //set time next call api
//           this.currentDate = endOfDay;
//           const filteredTransactions = response.data.transactions.filter((transaction: any) => {
//             const utime = transaction.utime;
//             // console.log(utime);
//             return utime >= startTimestamp && utime <= endTimestamp;
//           });

//           if (filteredTransactions.length === 0) {
//             console.log(`Account ${account.WalletAddress} has no transactions within the specified time range.`);
//           } else {
//             console.log(`Filtered transactions for account ${account.WalletAddress}`);
//           }

//           for (const transaction of filteredTransactions) {
//             const existingTransaction = await this.transactionModel.findOne({ hash: transaction.hash });
//             if (!existingTransaction) {
//               const newTransaction = new this.transactionModel(transaction);
//               await newTransaction.save();
//             }
//           }

//           const totalFee = filteredTransactions.reduce((sum: number, transaction: any) => {
//             return sum + (transaction.total_fees || 0);
//           }, 0);

//           const awards = await this.awardModel.find();
//           let highestAward = null;
//           awards.forEach((award) => {
//             if (parseInt(totalFee) >= parseInt(award.totalFee)) {
//               if (!highestAward || parseInt(award.totalFee) > parseInt(highestAward.totalFee)) {
//                 highestAward = award;
//               }
//             }
//           });

//           if (highestAward) {
//             console.log(`Account ${account.WalletAddress} has earned an award`);
//             console.log(highestAward);
//             await this.accountModel.updateOne(
//               { WalletAddress: account.WalletAddress },
//               {
//                 $push: {
//                   awards: {
//                     awardId: highestAward._id,
//                     claimed: false,
//                     create_at: new Date(),
//                     _id: new ObjectId()
//                   },
//                 },
//               }
//             );
//           }

//           return {
//             walletAddress: account.WalletAddress,
//             totalFee: totalFee,
//             transactions: {
//               transactions: filteredTransactions,
//             },
//           };
//         } catch (error) {
//           return {
//             walletAddress: account.WalletAddress,
//             error: error.response ? error.response.statusText : error.message,
//           };
//         }
//       });

//       const results = await Promise.allSettled(transactionsPromises);

//       const filteredResults = results
//         .filter((result) => result.status === 'fulfilled')
//         .map((result) => (result as PromiseFulfilledResult<any>).value); // Add type assertion here

//       // this.currentDate.setDate(this.currentDate.getDate() + 1);

//       return filteredResults;

//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       throw new HttpException('Error processing request: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import { Injectable, HttpException, HttpStatus, OnModuleDestroy } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../models/Transaction.model';
import { Account } from '../models/Account.model';
import { Award } from '../models/Award.model';
import { Setting } from '../models/Setting.model';
import * as moment from 'moment-timezone';
const { ObjectId } = require('mongodb');

@Injectable()
export class TransactionService implements OnModuleDestroy {
  private currentDate: Date;
  private pollInterval: NodeJS.Timeout;
  private lastStartTime: string;

  constructor(
    @InjectModel('Transaction') private readonly transactionModel: Model<Transaction>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('Award') private readonly awardModel: Model<Award>,
    @InjectModel('Setting') private readonly settingModel: Model<Setting>,
  ) {
    this.startPolling();
  }

  private async startPolling() {
    await this.updateCurrentDate(); // Initial update
    this.pollInterval = setInterval(async () => {
      await this.updateCurrentDate();
    }, 5000); // pool 5s
  }

  private async updateCurrentDate() {
    try {
      const time = await this.settingModel.findOne();
      if (time && time.StartTime) {
        const startTime = moment.utc(time.StartTime).toISOString();
        if (this.lastStartTime !== startTime) {
          this.currentDate = moment.utc(time.StartTime).toDate();
          this.lastStartTime = startTime;
          console.log('StartTime changed, updated current date:', this.currentDate);
        }
      } else {
        this.currentDate = moment.utc().startOf('day').toDate();
        this.lastStartTime = '';
        console.log('No StartTime set, using start of current day:', this.currentDate);
      }
    } catch (error) {
      console.error('Error updating current date:', error);
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private EndDayy: Date;
  async getAllTransactionItems(): Promise<any> {
    try {
      if (!this.currentDate) {
        await this.updateCurrentDate();
      }
      console.log("Current Date: ", this.currentDate);

      const accounts = await this.accountModel.find();
      if (!accounts || accounts.length === 0) {
        throw new HttpException('No accounts found', HttpStatus.NOT_FOUND);
      }

      const transactionsPromises = accounts.map(async (account, index) => {
        await this.delay(3500 * index);
        const net = await this.settingModel.findOne();
        const apiUrl = net.network === "testnet"
          ? `https://testnet.tonapi.io/v2/blockchain/accounts/${account.WalletAddress}/transactions`
          : `https://tonapi.io/v2/blockchain/accounts/${account.WalletAddress}/transactions`;
        // const apiUrl = `https://testnet.tonapi.io/v2/blockchain/accounts/${account.WalletAddress}/transactions`;
        try {
          const response = await axios.get(apiUrl);
          const startTimestamp = moment.utc(this.currentDate).unix();
          console.log("startTimestamp", startTimestamp);
          const hours = await this.settingModel.findOne();
          const endOfDay = moment.utc(this.currentDate).add(hours.settime, 'hours').toDate();
          console.log("endTime:", endOfDay);
          // nếu không có thay đổi từ database thì set endday = endofday = currentdate
          this.EndDayy = endOfDay;
          const endTimestamp = moment.utc(endOfDay).unix();
          console.log("endTimestamp", endTimestamp);

          // // Check if StartTime has changed
          // const time = await this.settingModel.findOne();
          // if (time && time.StartTime && moment.utc(time.StartTime).toISOString() !== this.lastStartTime) {
          //   this.currentDate = moment.utc(time.StartTime).toDate();
          //   this.lastStartTime = moment.utc(time.StartTime).toISOString();
          //   console.log('StartTime changed during transaction processing, updated current date:', this.currentDate);
          // } else {
          //   this.currentDate = endOfDay;
          // }

          const filteredTransactions = response.data.transactions.filter((transaction: any) => {
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

          const totalFee = filteredTransactions.reduce((sum: number, transaction: any) => {
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
      // Check if StartTime has changed
      const time = await this.settingModel.findOne();
      if (time && time.StartTime && moment.utc(time.StartTime).toISOString() !== this.lastStartTime) {
        this.currentDate = moment.utc(time.StartTime).toDate();
        this.lastStartTime = moment.utc(time.StartTime).toISOString();
        console.log('StartTime changed during transaction processing, updated current date:', this.currentDate);
      } else {
        this.currentDate = this.EndDayy;
      }
      const filteredResults = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<any>).value);

      return filteredResults;

    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new HttpException('Error processing request: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  onModuleDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }
}
