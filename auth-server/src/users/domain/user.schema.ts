import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  nexonId: string;

  @Prop({ required: true, unique: true, minlength: 4, maxlength: 20, match: /^[A-Za-z0-9]+$/ })
  mapleId: string;

  @Prop({ required: true, minlength: 6, maxlength: 16 })
  secondPassword: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  constructor(init: { nexonId: string; mapleId: string; secondPassword: string; role?: UserRole }) {
    this.nexonId = init.nexonId;
    this.mapleId = init.mapleId;
    this.secondPassword = init.secondPassword;
    this.role = init.role ?? UserRole.USER;
  }
}

export const UserSchema = SchemaFactory.createForClass(User); 