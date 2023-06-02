export class GetBalanceResponseDto {
    constructor(
        public _id: string,
        public balances: TokenBalance[],
    ) { }
}

class TokenBalance {
    symbol: string;
    value: string;
}