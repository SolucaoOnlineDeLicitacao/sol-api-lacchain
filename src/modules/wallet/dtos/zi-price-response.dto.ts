export class ZiPriceResposne {
    address: string
    name: string
    fully_diluted_valuation: string
    base_token_id: string
    price_in_usd: string
    price_in_target_token: string
    token_prices_by_token_id: TokenPricesByTokenId
}

interface TokenPricesByTokenId {
    "73": N733
    "13870076": N138700763
}

interface N733 {
    price_in_usd: string
    price_in_currency_token: string
    price_in_target_token: string
}

interface N138700763 {
    price_in_usd: string
    price_in_currency_token: string
    price_in_target_token: string
}