import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Setting extends Document {
  @Prop({ type: Date })
  StartTime: Date;

  @Prop()
  ss: string;

  @Prop()
  mm: string;

  @Prop()
  hh: string;

  @Prop()
  network: string;

  @Prop()
  mnemonics: string;

  @Prop()
  addresstoken: string;

  @Prop()
  addressholder: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
