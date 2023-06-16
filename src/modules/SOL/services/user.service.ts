import { UserTypeEnum } from '../enums/user-type.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegisterRequestDto } from '../dtos/user-register-request.dto';
import { UserRegisterResponseDto } from '../dtos/user-register-response.dto';
import { UserStatusEnum } from '../enums/user-status.enum';
import { UserRepository } from '../repositories/user.repository';

import * as bcrypt from 'bcryptjs';
import { UserUpdateRequestDto } from '../dtos/user-update-request.dto';
import { UserUpdateResponseDto } from '../dtos/user-update-response.dto';
import { UserUpdatePasswordRequestDto } from '../dtos/user-update-password-request.dto';

import { UserGetResponseDto } from '../dtos/user-get-response.dto';
import { UserUpdatePasswordWithCodeRequestDto } from '../dtos/user-update-password-with-code-request.dto';
import { VerificationService } from './verification.service';
import { UserRegisterPasswordRequestDto } from '../dtos/user-register-password-request.dto';
import { UserUpdateProfilePictureResponseDto } from '../dtos/user-update-profile-picture-response.dto';
import { UserInterface } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { UserListByTypeResponseDto } from '../dtos/user-list-by-type-response.dto';
import { UserUpdateByIdRequestDto } from '../dtos/user-update-by-id-request.dto';

@Injectable()
export class UserService {
  constructor(

    private readonly _userRepository: UserRepository,
  
    private readonly _verificationService: VerificationService,
  ) { }

  async getById(_id: string): Promise<UserGetResponseDto> {
    const result = await this._userRepository.getById(_id);
    
    return new UserGetResponseDto(
      result._id,
      result.name,
      result.email,
      result.phone,
      result.status,
      result.document,
      result.profilePicture,
      result.office,
      result.association,
      result.supplier,
      result.roles,
      result.notification_list
    );

  }

  async getByIdInternal(_id: string): Promise<UserInterface> {
    return await this._userRepository.getById(_id);
  }

  async getAll(): Promise<UserInterface[]> {
    return await this._userRepository.getAll();
  }

  async getByEmail(email: string): Promise<UserGetResponseDto> {
    const result = await this._userRepository.getByEmail(email);

    if (!result) throw new BadRequestException('Email não encontrado!');

    return new UserGetResponseDto(
      result._id,
      result.name,
      result.email,
      result.phone,
      result.status,
      result.document
    );
  }

  async getByEmailFirstAccess(email: string): Promise<UserGetResponseDto> {
    const result = await this._userRepository.getByEmail(email);

    if (!result) throw new BadRequestException('Email não encontrado!');

    if (result.status == UserStatusEnum.active) throw new BadRequestException('Você já realizou o primeiro acesso!');

    return new UserGetResponseDto(
      result._id,
      result.name,
      result.email,
      result.phone,
      result.status,
      result.document
    );
  }

  async register(
    dto: UserRegisterRequestDto,
  ): Promise<UserRegisterResponseDto> {

    if(dto.phone){
      const userByPhone = await this._userRepository.getByPhone(dto.phone);
      if(userByPhone) {
        throw new BadRequestException('Esse telefone ja foi cadastrado!');
      }
    }

    if(dto.document){
      const userByDocument = await this._userRepository.getByDocument(dto.document);
      if(userByDocument) {
        throw new BadRequestException('Esse CPF/CNPJ ja foi cadastrado!');
      }
    }

    dto.status = UserStatusEnum.inactive;


    const result = await this._userRepository.register(dto);
    if (!result)
      throw new BadRequestException('Email não encontrado!');

    return new UserRegisterResponseDto(
      result._id,
      result.email,
   
    );
  }

  async update(
    _id: string,
    dto: UserUpdateRequestDto,
  ): Promise<UserUpdateResponseDto> {
    const result = await this._userRepository.update(_id, dto);
    return new UserUpdateResponseDto(_id, result.email, result.name);
  }

  async updateById(_id: string, dto: UserUpdateByIdRequestDto): Promise<UserUpdateResponseDto> {
    const result = await this._userRepository.updateById(_id, dto);
    return new UserUpdateResponseDto(_id, result.email);
  }

  async updatePassword(
    _id: string,
    dto: UserUpdatePasswordRequestDto,
  ): Promise<UserUpdateResponseDto> {
    const user = await this._userRepository.getById(_id);

    if (!user) throw new BadRequestException('user not found!');

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new BadRequestException('wrong password!');

    dto.password = await bcrypt.hash(dto.newPassword, 13);

    const result = await this._userRepository.updatePassword(_id, dto);

    return new UserUpdateResponseDto(_id, result.email);
  }

  async registerPassword(
    _id: string,
    dto: UserRegisterPasswordRequestDto,
  ): Promise<UserUpdateResponseDto> {
    const user = await this._userRepository.getById(_id);

    dto.status = UserStatusEnum.active;

    if (!user) throw new BadRequestException('user not found!');

    dto.password = await bcrypt.hash(dto.password, 13);

    const result = await this._userRepository.registerPassword(_id, dto);

    return new UserUpdateResponseDto(_id, result.email);
  }

  async updatePasswordWithCode(
    dto: UserUpdatePasswordWithCodeRequestDto,
  ): Promise<UserUpdateResponseDto> {
    const userModel = await this._userRepository.getByEmail(dto.email);

    await this._verificationService.verifyCode(userModel, dto.code);

    const password = await bcrypt.hash(dto.newPassword, 13);

    await this._userRepository.updatePassword(userModel._id, {
      password: password,
      newPassword: '',
    });

    if (userModel.status == UserStatusEnum.inactive) {
      await this._userRepository.updateStatus(userModel._id, UserStatusEnum.active);
    }

    return new UserUpdateResponseDto(userModel._id, userModel.email);
  }

  async updateProfilePicture(_id: string, profilePicture: string): Promise<UserUpdateProfilePictureResponseDto> {

    const userModel = await this._userRepository.updateProfilePicture(_id, profilePicture)
    return new UserUpdateProfilePictureResponseDto(userModel.profilePicture);

  }

  async listByType(type: UserTypeEnum): Promise<UserListByTypeResponseDto[]> {

    const list = await this._userRepository.listByType(type);
    let response: UserListByTypeResponseDto[] = [];

    for (const iterator of list) {
      response.push(
        new UserListByTypeResponseDto(
          iterator._id,
          iterator.name,
          iterator.email,
          iterator.status,
          iterator.type,
          iterator.profilePicture,
          iterator.phone,
          iterator.document,
          iterator.office,
          iterator.association,
          iterator.supplier,
          iterator.roles
        ))
    }

    return response;

  }

  async deleteById(_id: string) {
    return await this._userRepository.deleteById(_id);
  }


}
