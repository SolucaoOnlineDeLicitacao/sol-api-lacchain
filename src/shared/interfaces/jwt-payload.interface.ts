export interface JwtPayload {
    userId: string;
    email: string;
    walletAddress: string;
    tfaRegistered: boolean;
    tfaAuthenticate: boolean;
}