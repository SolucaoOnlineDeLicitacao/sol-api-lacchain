export class TokenSwapResponseDto {

    constructor(
        public transferFeeToSwapWalletTransactionHash: string,
        public transferToSwapWalletTransactionHash: string,
        public transferToClientWalletTransactionHash: string,
    ) { }
}