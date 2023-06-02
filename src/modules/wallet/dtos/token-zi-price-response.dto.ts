export class TokenZiPriceToResponseDto {

    constructor(
        public value: number,
        public spread: number,
        public swappFee: number,
        public valuePlusSpread: number,
    ) { }
}