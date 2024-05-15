// import {
//     Address,
//     TonClient,
//     Cell,
//     beginCell,
//     storeMessage,
//     JettonMaster,
//     OpenedContract,
//     JettonWallet,
//     Transaction
// } from '@ton/ton';


// export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
//     let lastError: Error | undefined;
//     for (let i = 0; i < options.retries; i++) {
//         try {
//             return await fn();
//         } catch (e) {
//             if (e instanceof Error) {
//                 lastError = e;
//             }
//             await new Promise(resolve => setTimeout(resolve, options.delay));
//         }
//     }
//     throw lastError;
// }

// export async function tryProcessJetton(orderId: string) : Promise<string> {

//     const client = new TonClient({
//         endpoint: 'https://toncenter.com/api/v2/jsonRPC',
//         apiKey: 'a69144368c0811648a36446710aee333bf2b616ac46f1d325b841008fb346b1a', // https://t.me/tonapibot
//     });

//     interface JettonInfo {
//         address: string;
//         decimals: number;
//     }

//     interface Jettons {
//         jettonMinter : OpenedContract<JettonMaster>,
//         jettonWalletAddress: Address,
//         jettonWallet: OpenedContract<JettonWallet>
//     }

//     const MY_WALLET_ADDRESS = '0QB56RbbrikjhcKVegAfhExt9_RjOeDiyzaN2_IwtLEALhgm'; // your HOT wallet

//     const JETTONS_INFO : Record<string, JettonInfo> = {
//         'AL': {
//             address: '0:290a54cb2d1b7122f0123a98ef5df3889c6548fe7f2fbc0a3d4fbb5c9904c7c9', //
//             decimals: 9
//         },
//     }
//     const jettons: Record<string, Jettons> = {};

//     const prepare = async () => {
//         for (const name in JETTONS_INFO) {
//             const info = JETTONS_INFO[name];
//             const jettonMaster = client.open(JettonMaster.create(Address.parse(info.address)));
//             const userAddress = Address.parse(MY_WALLET_ADDRESS);

//             const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
//             console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

//             const jettonWallet = client.open(JettonWallet.create(jettonUserAddress));

//             //const jettonData = await jettonWallet;
//             const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

//             jettonData.stack.pop(); //skip balance
//             jettonData.stack.pop(); //skip owneer address
//             const adminAddress = jettonData.stack.readAddress();


//             if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
//                 throw new Error('jetton minter address from jetton wallet doesnt match config');
//             }

//             jettons[name] = {
//                 jettonMinter: jettonMaster,
//                 jettonWalletAddress: jettonUserAddress,
//                 jettonWallet: jettonWallet
//             };
//         }
//     }

//     const jettonWalletAddressToJettonName = (jettonWalletAddress : Address) => {
//         const jettonWalletAddressString = jettonWalletAddress.toString();
//         for (const name in jettons) {
//             const jetton = jettons[name];

//             if (jetton.jettonWallet.address.toString() === jettonWalletAddressString) {
//                 return name;
//             }
//         }
//         return null;
//     }

//     // Subscribe

//     const Subscription = async ():Promise<Transaction[]> =>{

//       const client = new TonClient({
//         endpoint: 'https://toncenter.com/api/v2/jsonRPC',
//         apiKey: 'a69144368c0811648a36446710aee333bf2b616ac46f1d325b841008fb346b1a', // https://t.me/tonapibot
//       });

//         const myAddress = Address.parse('0QCRxHZzINnVQnMzFlnpUdclIxuDIIvFuwSxW8vYeXHkXYNu'); // Address of receiver TON wallet
//         const transactions = await client.getTransactions(myAddress, {
//             limit: 5,
//         });
//         return transactions;
//     }




//     return retry(async () => {

//         await prepare();
//        const Transactions = await Subscription();

//         for (const tx of Transactions) {

//             const sourceAddress = tx.inMessage?.info.src;
//             if (!sourceAddress) {
//                 // external message - not related to jettons
//                 continue;
//             }

//             if (!(sourceAddress instanceof Address)) {
//                 continue;
//             }

//             const in_msg = tx.inMessage;

//             if (in_msg?.info.type !== 'internal') {
//                 // external message - not related to jettons
//                 continue;
//             }

//             // jetton master contract address check
//             const jettonName = jettonWalletAddressToJettonName(sourceAddress);
//             if (!jettonName) {
//                 // unknown or fake jetton transfer
//                 continue;
//             }

//             if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
//                 // no in_msg or in_msg body
//                 continue;
//             }

//             const msgBody = tx.inMessage;
//             const sender = tx.inMessage?.info.src;
//             const originalBody = tx.inMessage?.body.beginParse();
//             let body = originalBody?.clone();
//             const op = body?.loadUint(32);
//             if (!(op == 0x7362d09c)) {
//                 continue; // op == transfer_notification
//             }

//             console.log('op code check passed', tx.hash().toString('hex'));

//             const queryId = body?.loadUint(64);
//             const amount = body?.loadCoins();
//             const from = body?.loadAddress();
//             const maybeRef = body?.loadBit();
//             const payload = maybeRef ? body?.loadRef().beginParse() : body;
//             const payloadOp = payload?.loadUint(32);
//             if (!(payloadOp == 0)) {
//                 console.log('no text comment in transfer_notification');
//                 continue;
//             }

//             const comment = payload?.loadStringTail();
//             if (!(comment == orderId)) {
//                 continue;
//             }
            
//             console.log('Got ' + jettonName + ' jetton deposit ' + amount?.toString() + ' units with text comment "' + comment + '"');
//             const txHash = tx.hash().toString('hex');
//             return (txHash);
//         }
//         throw new Error('Transaction not found');
//     }, {retries: 30, delay: 1000});
// }
// import TonWeb from 'tonweb';
import { Address } from 'tonweb/dist/types/utils/address';
import { Cell } from 'tonweb/dist/types/boc/cell';
import { HttpProvider } from 'tonweb/dist/types/providers/http-provider';
const TonWeb = require('tonweb')
const provider = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC');
const tonweb = new TonWeb(provider);
import { mnemonicToPrivateKey } from '@ton/crypto';
const jettonMinterAddress = 'kQApClTLLRtxIvASOpjvXfOInGVI_n8vvAo9T7tcmQTHyaDZ'; // Địa chỉ contract của Jetton Minter
const senderPrivateKey = 'birth gather mechanic crouch female cake warrior year satisfy midnight foam chef ahead bus wasp where valve fly artist heavy smart pause brave mail'.split(" "); // Private key của người gửi

async function sendAward(destinationAddress: string, amount: string): Promise<any> {
    try {
        // Khởi tạo các khóa công khai và khóa bí mật
        let keyPair = await mnemonicToPrivateKey(senderPrivateKey);
        const wallet = tonweb.wallet.create({ publicKey: keyPair.publicKey });

        // Chuyển đổi amount sang nanoTON (nếu cần thiết)
        const amountNano = TonWeb.utils.toNano(amount);

        // Tạo giao dịch
        const seqno = await wallet.methods.seqno().call();
        const transfer = wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: destinationAddress,
            amount: amountNano,
            seqno: seqno,
            sendMode: 3,
            stateInit: undefined,
            payload: undefined,
        });

        // Ký và gửi giao dịch
        const transferResult = await transfer.send();
        console.log('Transfer result:', transferResult);

        return transferResult;
    } catch (error) {
        console.error('Error sending award:', error);
        throw error;
    }
}

// Ví dụ gọi hàm sendAward
sendAward('0QCRxHZzINnVQnMzFlnpUdclIxuDIIvFuwSxW8vYeXHkXYNu', '1.5').then(result => {
    console.log('Award sent successfully:', result);
}).catch(error => {
    console.error('Failed to send award:', error);
});

