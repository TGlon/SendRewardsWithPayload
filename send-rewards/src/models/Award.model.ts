import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Award extends Document {
  @Prop()
  totalFee: string;

  @Prop()
  awardFee: string;

  @Prop()
  receivingFee: string;
}

export const AwardSchema = SchemaFactory.createForClass(Award);
