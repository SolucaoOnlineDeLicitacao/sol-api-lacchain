export class AuthenticateResponseDto {
    constructor(
        public email: string,
        public name: string,
        public id: string,
        public token: string,
        public refreshToken: string,
        public type: string,
        public roles: string
    ) { }
}