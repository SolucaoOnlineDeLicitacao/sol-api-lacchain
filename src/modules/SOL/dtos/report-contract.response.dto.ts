export class ReportContractResponseDto {
    constructor(
        public assetsChart: number,
        public servicesChart: number,
        public constructionChart: number,
        public qtdBid: number,
        public estimatedTotalValueOfBids: number,
        public qtdAssets: number,
        public qtdServices: number,
        public qtdconstruction: number,
        public valueAssets: number,
        public valueServices: number,
        public valueconstruction: number,
    ) { }
}