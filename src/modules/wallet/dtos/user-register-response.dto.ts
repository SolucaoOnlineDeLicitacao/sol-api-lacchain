export class UserRegisterResponseDto {
    constructor(
        public _id: string,
        public email: string,
        public wallet: string,
    ) { }
}