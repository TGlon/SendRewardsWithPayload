import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { Setting } from '../models/Setting.model'; // Adjust the path as per your project structure
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class TransactionSchedulerService {
constructor(@InjectModel(Setting.name) private settingModel: Model<Setting>) {}    
  async fetchTransactions() {
    try {
      const response = await axios.get('http://localhost:3000/transactions');
      console.log('Transactions fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  }

  async getScheduleTimeFromDatabase(): Promise<string | null> {
    const setting = await this.settingModel.findOne();
    if (setting) {
        const ss = setting.ss || "*";   // mặc định 0h0p là sẽ get nếu không set trước
        const mm = setting.mm || "00"; //0 phút
        const hh = setting.hh || "00"; // 0h
        const cronExpression = `${ss} ${mm} ${hh} * * *`;
        return cronExpression;
    }
    return null;
  }

  async scheduleFetchTransactions() {
    const cronExpression = await this.getScheduleTimeFromDatabase();
    console.log(cronExpression);
    if (cronExpression) {
      cron.schedule(cronExpression, () => {
        console.log('Fetching transactions based on schedule from database');
        this.fetchTransactions();
      });
    } else {
      console.log('Could not find valid schedule time from database');
    }
  }
}
