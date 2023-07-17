import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserStatusEnum } from "../enums/user-status.enum";
import { UserTypeEnum } from '../enums/user-type.enum';
import { UserRolesEnum } from "../enums/user-roles.enum";
import { Association } from './association.schema';
import { Notification } from './notification.schema';
import { Supplier } from './supplier.schema';

@Schema({ timestamps: true, collection: User.name.toLowerCase() })
export class User {

    @Prop({ required: true, })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: false })
    password: string;

    @Prop({ required: false })
    document: string;

    @Prop({ required: false })
    phone: string;

    @Prop({ required: true, enum: [UserStatusEnum.active, UserStatusEnum.inactive] })
    status: string;

    @Prop({ required: true, enum: Object.keys(UserTypeEnum) })
    type: UserTypeEnum;

    @Prop({ required: false, default: null })
    profilePicture: string;

    @Prop({ required: false })
    office: string;

    @Prop({ required: false,  type: mongoose.Schema.Types.ObjectId, ref: Association.name  })
    association: Association;

    @Prop({ required: false, type:mongoose.Schema.Types.ObjectId, ref: Supplier.name})
    supplier: Supplier;

    @Prop({ required: false, enum: Object.keys(UserRolesEnum) })
    roles: UserRolesEnum;

    @Prop({ required: false, type: mongoose.Schema.Types.Array, ref: Notification.name })
    notification_list: Notification[]
    
}
export const UserSchema = SchemaFactory.createForClass(User);