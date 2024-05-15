import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../models/Account.model';
import { Award } from '../models/Award.model';
import { Currency } from 'src/models/Currency.model';
import { Types } from 'mongoose';
@Controller('transfer_claim')
export class TransferController {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('Award') private readonly awardModel: Model<Award>,
    @InjectModel('Currency') private readonly currencyModel: Model<Currency>,
    private readonly transferService: TransferService
  ) { }

  @Get(':address/:_id')
  async transferClaim(
    @Param('address') address: string,
    @Param('_id') _id: string,
    @Res() res
  ) {
    try {
      // Find the account with the given address
      const account = await this.accountModel.findOne({ WalletAddress: address }).exec();
      if (!account) {
        throw new NotFoundException("Account not found");
      }
      // Ensure the account has the awards property and it's an array
      if (!account.awards || !Array.isArray(account.awards)) {
        throw new NotFoundException("Awards not found for the account");
      }

      // Find the award object within the account's awards array
      const award = account.awards.find(item => item._id.toString() === _id);
      if (!award) {
        throw new NotFoundException("Award not found");
      }

      const awardId = award.awardId;
      //   console.log(awardId);

      const foundAward = await this.awardModel.findById(awardId);
      console.log(foundAward);

      const foundCurrency = await this.currencyModel.findById(foundAward.receivingFee);
      const amount = foundCurrency.TON; //phí trả để nhận quà.
      //   console.log(amount);

      const AddressReceiServer = "0QB56RbbrikjhcKVegAfhExt9_RjOeDiyzaN2_IwtLEALhgm";
      const transactionHash = await this.transferService.createTransfer(AddressReceiServer, amount, address);
      //   console.log(transactionHash);
      if (transactionHash) {
        const amount = foundAward.awardFee;
        console.log(amount);
        const sendResult = await this.transferService.sendAward(address, amount);
        if (sendResult) {
          console.log("Token sent successfully");
          const objectId = new Types.ObjectId(_id);
          const updateClaimed = await this.accountModel.updateOne(
            {
              "awards._id": objectId,
              WalletAddress: address,
            },
            {
              $set: { "awards.$.claimed": true },
            }
          ).exec();
        }
      }
      // Return the transaction hash
      return res.status(200).json({ transactionHash });
    } catch (error) {
      // Handle errors
      return res.status(404).json({ error: error.message });
    }
  }
}
