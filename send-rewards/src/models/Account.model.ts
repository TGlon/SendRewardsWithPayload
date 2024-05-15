import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

class AwardsItem{
    @Prop({type: SchemaTypes.ObjectId, ref: 'Award'})
    awardId: string;
    @Prop()
    claimed: boolean;
    @Prop()
    create_at: Date;
    @Prop({ type: SchemaTypes.ObjectId })
    _id: string;
}
@Schema()
export class Account extends Document {
  @Prop()
  WalletAddress: string;

  @Prop()
  mnemonics: string;

  @Prop({ type: [AwardsItem], default: [] })
  awards: AwardsItem[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
