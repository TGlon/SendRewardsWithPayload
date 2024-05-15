import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Account } from '../models/Account.model';
import { Setting } from '../models/Setting.model';
// import TonWeb from 'tonweb';
import { TonClient, WalletContractV4, internal, toNano, SendMode, Address } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto'
const TonWeb = require('tonweb')
@Injectable()
export class TransferService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('Setting') private readonly settingModel: Model<Setting>,
  ) { }
    // private client = new TonClient({
    //     endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=12ef1fc91b0d4ee237475fed09efc66af909d83f72376c7c3c42bc9170847ecb",
    // });
    private async getTonClient(): Promise<TonClient> {
      const setting = await this.settingModel.findOne();
      const endpoint = setting.network === 'testnet'
        ? 'https://testnet.toncenter.com/api/v2/jsonRPC?api_key=12ef1fc91b0d4ee237475fed09efc66af909d83f72376c7c3c42bc9170847ecb'
        : 'https://toncenter.com/api/v2/jsonRPC?api_key=12ef1fc91b0d4ee237475fed09efc66af909d83f72376c7c3c42bc9170847ecb';
  
      return new TonClient({ endpoint });
    }
    async createTransfer(AddressReceiServer: string, amount: string, address: string): Promise<string> {
        const account = await this.accountModel.findOne({ WalletAddress: address });
        const mnemo = account.mnemonics;
        let mnemonics = mnemo.split(" ");
        let keyPair = await mnemonicToPrivateKey(mnemonics);
        let wallet = WalletContractV4.create({
            workchain: 0,
            publicKey: keyPair.publicKey,
        });
        // let contract = this.client.open(wallet);
        const client = await this.getTonClient();
        const contract = client.open(wallet);
        let seqno = await contract.getSeqno();

        const internal_msg = internal({
            to: AddressReceiServer,
            bounce: Address.parseFriendly(address).isBounceable,
            value: toNano(amount),
            init: undefined,
        });

        const transfer = contract.createTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            messages: [internal_msg],
        });

        await contract.send(transfer);
        return internal_msg.body.hash().toString("hex");
    }

    async sendAward(destinationAddress: string, amount: string) {
      try {
        const setting = await this.settingModel.findOne();

        const endpoint = setting.network === 'testnet'
        ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
        : 'https://toncenter.com/api/v2/jsonRPC';

        const apiKey =
          "a69144368c0811648a36446710aee333bf2b616ac46f1d325b841008fb346b1a";
    
        // Initialize TonWeb with HTTP provider
        const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint, { apiKey }));
    
        // Initialize wallet using mnemonics to derive the keyPair
        const mne = setting.mnemonics;
        const mnemonics = mne.split(" ");
        let keyPair = await mnemonicToPrivateKey(mnemonics);
        const WalletClass = tonweb.wallet.all["v4R2"];
        const wallet = new WalletClass(tonweb.wallet.provider, {
          publicKey: keyPair.publicKey,
        });
        const seqno = await wallet.methods.seqno().call();
    
        const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
          address: setting.addresstoken, // Contract address
        });
        
        const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
          new TonWeb.utils.Address(setting.addressholder)
        );
        console.log(
          "My jetton wallet for is " +
            jettonWalletAddress.toString(true, true, true)
        );
    
        const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
          address: jettonWalletAddress,
        });
    
        const jettonWalletDes = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
          address: destinationAddress,
        });
    
        const transferResult = await wallet.methods
          .transfer({
            secretKey: keyPair.secretKey,
            toAddress: jettonWallet.address, // address of Jetton wallet of Jetton sender
            amount: TonWeb.utils.toNano("0.05"), // total amount of TONs attached to the transfer message
            seqno: seqno,
            payload: await jettonWallet.createTransferBody({
              jettonAmount: TonWeb.utils.toNano(amount.toString()), // Jetton amount (in basic indivisible units)
              toAddress: new TonWeb.utils.Address(
                jettonWalletDes.address.toString()
              ), // recepient user's wallet address (not Jetton wallet)
              forwardAmount: TonWeb.utils.toNano("0.01"), // some amount of TONs to invoke Transfer notification message
              forwardPayload: new TextEncoder().encode("gift"), // text comment for Transfer notification message
              responseAddress: new TonWeb.utils.Address(
                jettonWalletDes.address.toString()
              ), // return the TONs after deducting commissions back to the sender's wallet address
            }),
            sendMode: 3,
          })
          .send();
    
        return transferResult;
      } catch (error) {
        console.error("Failed to send Jettons:", error);
        throw new Error("Failed to send Jettons");
      }
    }
}
