import { Injectable, Logger } from "@nestjs/common";
import { S3Service } from "src/shared/services/s3.service";
import { PixConfirmationGetResponseDto } from "../dtos/pix-confirmation-get.dto";
import { PixConfirmationRegisterRequestDto } from "../dtos/pix-confirmation-register-request.dto";
import { PixConfirmationRegisterResponseDto } from "../dtos/pix-confirmation-register-response.dto";
import { PixConfirmationDto } from "../dtos/pix-confirmation-response.dto";
import { PixConfirmationStatus } from "../dtos/pix-confirmation-status";
import { PixConfirmationUpdateStatusRequestDto } from "../dtos/pix-confirmation-update-status-request.dto";
import { PixConfirmationUpdateStatusResponseDto } from "../dtos/pix-confirmation-update-status-response.dto";
import { PixConfirmationRepository } from "../repositories/pix-confirmation.repository";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class PixConfirmationService {

    private readonly _logger = new Logger(PixConfirmationService.name);

    constructor(
        private readonly _pixConfirmationRepository: PixConfirmationRepository,
        private readonly _userRepository: UserRepository,
        private readonly _s3Service: S3Service,
    ) { }

    async listByStatus(status: PixConfirmationStatus): Promise<PixConfirmationGetResponseDto[]> {

        let result: PixConfirmationGetResponseDto[] = [];

        const models = await this._pixConfirmationRepository.listByStatus(status);

        models.forEach((item) => {
            result.push(new PixConfirmationGetResponseDto(
                item._id,
                item.pixValue,
                item.pixVoucher,
                item.tokenValue,
                item.status,
                item.user,
            ));
        });

        return result;
    }

    async list(): Promise<PixConfirmationDto[]> {
        return this._pixConfirmationRepository.list();
    }

    async listByUser(userId: string, dateFrom: string, dateTo: string, status: string): Promise<PixConfirmationDto[]> {
        return this._pixConfirmationRepository.listByUser(userId, dateFrom, dateTo, status);
    }

    async register(userId: string, dto: PixConfirmationRegisterRequestDto): Promise<PixConfirmationRegisterResponseDto> {

        const now = new Date();

        dto.userId = userId;

        dto.user = await this._userRepository.getById(dto.userId);

        dto.status = PixConfirmationStatus.pending;

        const pixVoucherUpload = await this._s3Service.upload(
            `${dto.user.wallet.address}_${now.getTime()}_pix_voucher`,
            dto.pixVoucher
        );

        dto.pixVoucher = pixVoucherUpload.Location;

        const result = await this._pixConfirmationRepository.register(dto);

        return new PixConfirmationRegisterResponseDto(
            result._id,
        );
    }

    async updateStatus(_id: string, dto: PixConfirmationUpdateStatusRequestDto): Promise<PixConfirmationUpdateStatusResponseDto> {
        const result = await this._pixConfirmationRepository.updateStatus(_id, dto);
        return new PixConfirmationUpdateStatusResponseDto(result._id);
    }
}