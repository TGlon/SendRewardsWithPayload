import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
  @Prop()
  hash: string;

  @Prop()
  lt: string;

  @Prop({ type: Object })
  account: {
    address: string;
    is_scam: boolean;
    is_wallet: boolean;
  }
  @Prop()
  utime: string;

  @Prop()
  total_fees: string;

  @Prop()
  transaction_type: string;

  @Prop()
  block: string;

  @Prop({ type: Object }) // Specify the type for credit_phase
  credit_phase: {
    fees_collected: string;
    credit: string;
  };

  @Prop({ type: Object })
  in_msg: {
    msg_type: string;
    created_lt: string;
    ihr_disabled: boolean;
    bounce: boolean;
    bounced: boolean;
    value: string;
    fwd_fee: string;
    ihr_fee: string;
    destination: {
      address: string;
      is_scam: boolean;
      is_wallet: boolean;
    };
    source: {
      address: string;
      is_scam: boolean;
      is_wallet: boolean;
    };
    import_fee: string;
    created_at: string;
  };

  @Prop({ type: Array })
  out_msgs: Array<{
    msg_type: string;
    created_lt: string;
    ihr_disabled: boolean;
    bounce: boolean;
    bounced: boolean;
    value: string;
    fwd_fee: string;
    ihr_fee: string;
    destination: {
      address: string;
      is_scam: boolean;
      is_wallet: boolean;
    };
    source: {
      address: string;
      is_scam: boolean;
      is_wallet: boolean;
    };
    import_fee: string;
    created_at: string;
  }>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
