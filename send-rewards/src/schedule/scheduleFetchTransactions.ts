// import { Injectable } from '@nestjs/common';
// import * as cron from 'node-cron';
// import axios from 'axios';
// import { Setting } from '../models/Setting.model'; // Adjust the path as per your project structure
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// @Injectable()
// export class TransactionSchedulerService {
// constructor(@InjectModel(Setting.name) private settingModel: Model<Setting>) {}   

//   async fetchTransactions() {
//     try {
//       const response = await axios.get('http://localhost:3000/transactions');
//       console.log('Transactions fetched successfully:', response.data);
//     } catch (error) {
//       console.error('Error fetching transactions:', error.message);
//     }
//   }

//   async getScheduleTimeFromDatabase(): Promise<string | null> {
//     const setting = await this.settingModel.findOne();
//     if (setting) {
//         const ss = setting.ss || "*";   // mặc định 0h0p là sẽ get nếu không set trước
//         const mm = setting.mm || "00"; //0 phút
//         const hh = setting.hh || "00"; // 0h
//         const cronExpression = `${ss} ${mm} ${hh} * * *`;
//         return cronExpression;
//     }
//     return null;
//   }

//   async scheduleFetchTransactions() {
//     const cronExpression = await this.getScheduleTimeFromDatabase();
//     console.log(cronExpression);
//     if (cronExpression) {
//       cron.schedule(cronExpression, () => {
//         console.log('Fetching transactions based on schedule from database');
//         this.fetchTransactions();
//       });
//     } else {
//       console.log('Could not find valid schedule time from database');
//     }
//   }
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { Setting } from '../models/Setting.model'; // Adjust the path as per your project structure
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionSchedulerService implements OnModuleInit, OnModuleDestroy {
  private currentCronJob: cron.ScheduledTask;
  private pollCronJob: cron.ScheduledTask;
  private lastCronExpression: string | null = null;

  constructor(@InjectModel(Setting.name) private settingModel: Model<Setting>) { }

  async fetchTransactions() {
    try {
      const url = process.env.SCHEDULE_URI;
      const response = await axios.get(`${url}`);
      console.log('Transactions fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  }

  async getScheduleTimeFromDatabase(): Promise<string | null> {
    const setting = await this.settingModel.findOne();
    if (setting) {
      const ss = setting.ss || "*";   // Default to every second if not set
      const mm = setting.mm || "00";  // Default to 0 minute
      const hh = setting.hh || "00";  // Default to 0 hour
      const cronExpression = `${ss} ${mm} ${hh} * * *`;
      return cronExpression;
    }
    return null;
  }

  async scheduleFetchTransactions() {
    const cronExpression = await this.getScheduleTimeFromDatabase();
    // console.log('Current cron expression:', cronExpression);

    if (cronExpression && cronExpression !== this.lastCronExpression) {
      if (this.currentCronJob) {
        this.currentCronJob.stop();
      }

      this.currentCronJob = cron.schedule(cronExpression, () => {
        console.log('Fetching transactions based on schedule from database');
        this.fetchTransactions();
      });

      this.lastCronExpression = cronExpression;
    } else if (!cronExpression) {
      console.log('Could not find valid schedule time from database');
    }
  }

  async pollForScheduleChanges() {
    this.pollCronJob = cron.schedule('*/5 * * * * *', async () => {
      await this.scheduleFetchTransactions();
    });
  }

  async onModuleInit() {
    await this.scheduleFetchTransactions();
    await this.pollForScheduleChanges();
  }

  onModuleDestroy() {
    if (this.currentCronJob) {
      this.currentCronJob.stop();
    }
    if (this.pollCronJob) {
      this.pollCronJob.stop();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
