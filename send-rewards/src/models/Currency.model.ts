import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema()
export class Currency extends Document {
  @Prop()
  TON: string;

  @Prop()
  VND: string;

  @Prop()
  USD: string;

}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
