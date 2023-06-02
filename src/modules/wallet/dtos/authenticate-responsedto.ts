export class AuthenticateResponseDto {
    constructor(
        public email: string,
        public name: string,
        public token: string,
        public refreshToken: string,
        public wallet: string,
        public type: string
    ) { }
}