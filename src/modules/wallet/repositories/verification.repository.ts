import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Verification } from "../schemas/verification.schema";
import { VerificationModel } from "../models/verification.model";
import { VerificationRegisterRequestDto } from "../dtos/vertification-register-request.dto";
import { UserModel } from "../models/user.model";

@Injectable()
export class VerificationRepository {

    private readonly logger = new Logger(VerificationRepository.name);

    constructor(
        @InjectModel(Verification.name) private readonly model: Model<VerificationModel>,
    ) { }

    async save(dto: VerificationRegisterRequestDto): Promise<VerificationModel> {
        const data = new this.model(dto);
        return await data.save();
    }

    async getById(id: string): Promise<VerificationModel> {
        return await this.model.findById(id);
    }

    async getByUser(user: UserModel): Promise<VerificationModel> {
        return await this.model.findOne({ user: user._id.toString() })
            .populate('user');
    }

    async delete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    async incrementAttempt(_id: string, attempt: number) {
        return await this.model.findOneAndUpdate(
            { _id },
            {
                $set: {
                    attempt,
                },
            },
        );
    }
}