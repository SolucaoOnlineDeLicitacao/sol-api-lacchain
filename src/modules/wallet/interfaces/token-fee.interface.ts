export interface TokenFeeInterface extends Document {
    readonly symbol: string;
    readonly buy: number;
    readonly sell: number;
}