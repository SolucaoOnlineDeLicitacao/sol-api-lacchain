import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { UserRegisterRequestDto } from "../dtos/user-register-request.dto";
import { UserUpdatePasswordRequestDto } from "../dtos/user-update-password-request.dto";
import { UserStatusEnum } from "../enums/user-status.enum";
import { UserModel } from "../models/user.model";
import { UserUpdateRequestDto } from "../dtos/user-update-request.dto";
import { UserRegisterPasswordRequestDto } from "../dtos/user-register-password-request.dto";
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserUpdateByIdRequestDto } from "../dtos/user-update-by-id-request.dto";
import { NotificationInterface } from "../interfaces/notification.interface";

@Injectable()
export class UserRepository {

    constructor(
        @InjectModel(User.name) private readonly _model: Model<UserModel>,
    ) { }

    async getByEmail(email: string): Promise<UserModel> {
        return await this._model
            .findOne({ email });
    }

    async getByPhone(phone: string): Promise<UserModel> {
        return await this._model
            .findOne({ phone });
    }

    async getByDocument(document: string): Promise<UserModel> {
        return await this._model
            .findOne({ document });
    }

    async getAll(): Promise<UserModel[]> {
        return await this._model
            .find();
    }

    async getById(_id: string): Promise<UserModel> {
        return await this._model
            .findById({ _id }).populate('association');
     
    }

    async listByType(type: UserTypeEnum): Promise<UserModel[]> {
        return await this._model.find({ type }).populate('association');
    }

    async register(dto: UserRegisterRequestDto): Promise<UserModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async updatePassword(_id: string, dto: UserUpdatePasswordRequestDto): Promise<UserModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                password: dto.password
            }
        });
    }

    async updateNotifications(_id: string, dto: NotificationInterface): Promise<UserModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $push: {
                notification_list: dto
            }
        });
    }

    async update(_id: string, dto: UserUpdateRequestDto): Promise<UserModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                name: dto.name,
              
               
            }
        });
    }

    async updateById(_id: string, dto: UserUpdateByIdRequestDto): Promise<UserModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                email: dto.email,
                name: dto.name,
                phone: dto.phone,
                type: dto.type,
                document: dto.document,
                office: dto.office,
                association: dto.association,
                supplier: dto.supplier,
                roles: dto.roles
            }
        });
    }

    async updateRefreshToken(_id: string, refreshToken: string | null): Promise<UserModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                refreshToken
            }
        });
    }

    async registerPassword(_id: string, dto: UserRegisterPasswordRequestDto): Promise<UserModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                password: dto.password,
                status: dto.status
            }
        });
    }

    async updateStatus(_id: string, status: UserStatusEnum): Promise<UserModel> {
        return await this._model.findOneAndUpdate(
            { _id },
            {
                $set: {
                    status
                },
            },
        );
    }

    async addDeviceToken(token: string, id: string) {
        await this._model.findByIdAndUpdate(id, {
            $push: {
                pushNotificationToken: token
            }
        });
    }

    async removeDeviceToken(token: string, id: string) {
        await this._model.findByIdAndUpdate(id, {
            $pull: {
                'pushNotificationToken': token
            }
        });
    }

    async updateProfilePicture(_id: string, profilePicture: string): Promise<UserModel> {
        return await this._model.findOneAndUpdate(
            { _id },
            {
                $set: {
                    profilePicture
                },
            },
        );
    }

    async deleteById(_id: string) {
        return await this._model.findOneAndDelete({ _id });
    }

}
