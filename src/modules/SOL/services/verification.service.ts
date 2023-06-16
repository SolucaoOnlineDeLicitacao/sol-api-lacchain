import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { VerificationRepository } from "../repositories/verification.repository";
import { VerificationRegisterRequestDto } from "../dtos/vertification-register-request.dto";
import { EmailService } from "src/shared/services/email.service";
import NumberUtil from "src/shared/utils/number.util";
import { UserGetResponseDto } from "../dtos/user-get-response.dto";
import { UserRepository } from "../repositories/user.repository";
import { VerificationRegisterResponseDto } from "../dtos/vertification-register-response.dto";
import { UserModel } from "../models/user.model";
import { UserResetPasswordResendEmailRequestDto } from "../dtos/user-reset-password-resend-email-request.dto";
import { UserResetPasswordResendEmailResponseDto } from "../dtos/user-reset-password-resend-email-response.dto";
import { UserConfirmationRegisterSendRequestDto } from "../dtos/user-confirmation-register-request.dto";
import { UserRegisterResendEmailRequestDto } from "../dtos/user-register-resend-email-request.dto";

@Injectable()
export class VerificationService {

    private readonly logger = new Logger(VerificationService.name);

    constructor(
        private readonly emailService: EmailService,
        private readonly verificationRepository: VerificationRepository,
        private readonly userRepository: UserRepository,
    ) { }

    async send(user: UserGetResponseDto): Promise<VerificationRegisterResponseDto> {

        const userModel = await this.userRepository.getById(user._id);


        let verification = await this.verificationRepository.getByUser(userModel);

        if (verification) {
            const now = new Date();
            if (now < verification.deadline) {
                throw new UnauthorizedException(
                    'Um código já foi enviado e está válido!',
                );
            } else {
                await this.verificationRepository.delete(verification._id);
            }
        }

        let deadline: Date = new Date();
        deadline.setMinutes(deadline.getMinutes() + 5);

        const code = NumberUtil.generateRandomNumber();

        verification = await this.verificationRepository.save(
            new VerificationRegisterRequestDto(
                0,
                deadline,
                userModel,
                code,
            )
        );

        await this.sendVerificationEmail(
            userModel,
            'LACCHAIN - Alteração de senha',
            `Olá ${user.name}, foi solicitado a alteração de senha!`,
            `Código: ${verification.code.toString()}`,
        );

        return new VerificationRegisterResponseDto(
            userModel.email
        );
    }

    async sendRegister(user: UserGetResponseDto): Promise<VerificationRegisterResponseDto> {

        const userModel = await this.userRepository.getById(user._id);

        let verification = await this.verificationRepository.getByUser(userModel);

        if (verification) {
            const now = new Date();
            if (now < verification.deadline) {
                throw new UnauthorizedException(
                    'Um código já foi enviado e está válido!',
                );
            } else {
                await this.verificationRepository.delete(verification._id);
            }
        }

        let deadline: Date = new Date();
        deadline.setMinutes(deadline.getMinutes() + 5);

        const code = NumberUtil.generateRandomNumber();

        verification = await this.verificationRepository.save(
            new VerificationRegisterRequestDto(
                0,
                deadline,
                userModel,
                code,
            )
        );

        await this.sendVerificationEmail(
            userModel,
            'LACCHAIN - Confirmação de cadastro',
            `Olá ${user.name},`,
            `seu codigo para confirmação de cadastro é: ${verification.code.toString()}`,
        );

        return new VerificationRegisterResponseDto(
            userModel.email
        );
    }

    // async sendSms(dto: UserConfirmationRegisterSendRequestDto): Promise<UserResetPasswordResendEmailResponseDto> {
    //     const userModel = await this.userRepository.getByPhone(dto.value);

    //     let verification = await this.verificationRepository.getByUser(userModel);

    //     if (verification) {
    //         const now = new Date();
    //         if (now < verification.deadline) {
    //             throw new UnauthorizedException(
    //                 'Um sms já foi enviado e está válido!',
    //             );
    //         } else {
    //             await this.verificationRepository.delete(verification._id);
    //         }
    //     }

    //     let deadline: Date = new Date();
    //     deadline.setMinutes(deadline.getMinutes() + 5);

    //     const code = NumberUtil.generateRandomNumber();

    //     verification = await this.verificationRepository.save(
    //         new VerificationRegisterRequestDto(
    //             0,
    //             deadline,
    //             userModel,
    //             code,
    //         )
    //     );

    //     let message = `LACCHAIN - Confirmação de cadastro,
    //     Ola ${userModel.name}, seu codigo para confirmação de cadastro é ${code}`

    //     await this.smsRepository.send(dto.value, message);

    //     return new UserResetPasswordResendEmailResponseDto(
    //         verification._id,
    //         userModel.email,
    //     );
    // }

    async resendResetPasswordEmail(dto: UserResetPasswordResendEmailRequestDto): Promise<UserResetPasswordResendEmailResponseDto> {

        const userModel = await this.userRepository.getByEmail(dto.email);

        let verification = await this.verificationRepository.getByUser(userModel);

        if (verification) {
            const now = new Date();
            if (now < verification.deadline) {
                throw new UnauthorizedException(
                    'Um email já foi enviado e está válido!',
                );
            } else {
                await this.verificationRepository.delete(verification._id);
            }
        }

        let deadline: Date = new Date();
        deadline.setMinutes(deadline.getMinutes() + 5);

        const code = NumberUtil.generateRandomNumber();

        verification = await this.verificationRepository.save(
            new VerificationRegisterRequestDto(
                0,
                deadline,
                userModel,
                code,
            )
        );

        await this.sendVerificationEmail(
            userModel,
            'INKLUSIVA - Alteração de senha',
            `Olá ${userModel.name}, foi solicitado a alteração de senha!`,
            `Código: ${verification.code.toString()}`,
        );

        return new UserResetPasswordResendEmailResponseDto(
            verification._id,
            userModel.email,
        );
    }

    async resendCodeRegisterEmail(dto: UserRegisterResendEmailRequestDto): Promise<UserResetPasswordResendEmailResponseDto> {

        const userModel = await this.userRepository.getByEmail(dto.email);

        let verification = await this.verificationRepository.getByUser(userModel);

        if (verification) {
            await this.verificationRepository.delete(verification._id);
        }

        let deadline: Date = new Date();
        deadline.setMinutes(deadline.getMinutes() + 5);

        const code = NumberUtil.generateRandomNumber();

        verification = await this.verificationRepository.save(
            new VerificationRegisterRequestDto(
                0,
                deadline,
                userModel,
                code,
            )
        );

        await this.sendVerificationEmail(
            userModel,
            'LACCHAIN - Confirmação de cadastro',
            `Olá ${userModel.name},`,
            `seu codigo para confirmação de cadastro é: ${verification.code.toString()}`,
        );

        return new UserResetPasswordResendEmailResponseDto(
            verification._id,
            userModel.email,
        );
    }

    // async resendCodeRegisterSms(dto: UserRegisterResendEmailRequestDto): Promise<UserResetPasswordResendEmailResponseDto> {

    //     const userModel = await this.userRepository.getByEmail(dto.email);

    //     let verification = await this.verificationRepository.getByUser(userModel);

    //     if (verification) {
    //         await this.verificationRepository.delete(verification._id);
    //     }

    //     let deadline: Date = new Date();
    //     deadline.setMinutes(deadline.getMinutes() + 5);

    //     const code = NumberUtil.generateRandomNumber();

    //     verification = await this.verificationRepository.save(
    //         new VerificationRegisterRequestDto(
    //             0,
    //             deadline,
    //             userModel,
    //             code,
    //         )
    //     );

    //     let message = `LACCHAIN - Confirmação de cadastro,
    //     Ola ${userModel.name}, seu codigo para confirmação de cadastro é ${code}`

    //     await this.smsRepository.send(userModel.phone, message);

    //     return new UserResetPasswordResendEmailResponseDto(
    //         verification._id,
    //         userModel.email,
    //     );
    // }

    async verifyCode(user: UserModel, code: number) {

        const verification = await this.verificationRepository.getByUser(user);

        let response;

        if (!verification)
            throw new NotFoundException('Código expirado!');
        response = false;

        const now = new Date();
        if (now > verification.deadline) {
            await this.verificationRepository.delete(verification._id);
            throw new UnauthorizedException('Código expirado!');
            response = false;
        }

        if (verification.attempt == 5) {
            await this.verificationRepository.delete(verification._id);
            throw new UnauthorizedException(
                'Você excedeu o limite de 5 tentativas!',
            );
            response = false;
        }

        if (verification.code != code) {
            this.incrementAttempt(verification._id);
            throw new UnauthorizedException('Código inválido!');
            response = false;
        }

        await this.verificationRepository.delete(verification._id);

        response = true;

        return response;
    }

    async sendFirstAcess(user: UserGetResponseDto): Promise<VerificationRegisterResponseDto> {

        const userModel = await this.userRepository.getById(user._id);

        let verification = await this.verificationRepository.getByUser(userModel);

        if (verification) {
            const now = new Date();
            if (now < verification.deadline) {
                throw new UnauthorizedException(
                    'Um código já foi enviado e está válido!',
                );
            } else {
                await this.verificationRepository.delete(verification._id);
            }
        }

        let deadline: Date = new Date();
        deadline.setMinutes(deadline.getMinutes() + 5);

        const code = NumberUtil.generateRandomNumber();

        verification = await this.verificationRepository.save(
            new VerificationRegisterRequestDto(
                0,
                deadline,
                userModel,
                code,
            )
        );

        await this.sendVerificationEmail(
            userModel,
            'LACCHAIN - Primeiro Acesso',
            'LACCHAIN - Primeiro Acesso',
            `Olá ${user.name}, foi solicitado o código de primeiro acesso! <br> Código: <b>${verification.code.toString()}</b>`,
        );

        return new VerificationRegisterResponseDto(
            userModel.email
        );
    }

    private async incrementAttempt(_id: any) {
        const verification = await this.verificationRepository.getById(_id);
        const attempt = verification.attempt + 1;
        await this.verificationRepository.incrementAttempt(_id, attempt);
    }

    private async sendVerificationEmail(
        user: UserModel,
        title: string,
        text: string,
        html: string,
    ) {
        const verification = await this.verificationRepository.getByUser(user);

        await this.emailService.sendEmail(
            verification.user.email,
            title,
            text,
            html,
        );

        return verification;
    }
}