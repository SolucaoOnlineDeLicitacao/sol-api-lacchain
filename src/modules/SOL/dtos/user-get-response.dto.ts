export class UserGetResponseDto {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public phone: string,
        public status: string,
        public wallet: string,
        public document: string,
        public profilePicture?: string,
        public office?: string,
        public association?: string,
        public supplier?: string,
        public roles?: string,
        
    ) { }
}