import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ethers } from "ethers";
import { GasStationPriorityEnum } from "../dtos/gas-station-priority.enum";

@Injectable()
export class GasStationService {

    private readonly _logger = new Logger(GasStationService.name);

    private _apiUrl = 'https://gasstation-mumbai.matic.today/v2';

    constructor(
        private readonly httpService: HttpService,
    ) {
        if (process.env.NODE_ENV === 'prod')
            this._apiUrl = `https://gasstation-mainnet.matic.network/v2`;
    }

    async getMaticEstimatedFee(priority: GasStationPriorityEnum) {

        const estimatedGas = await this.httpService
            .get(this._apiUrl)
            .toPromise();

        let result;

        switch (priority) {
            case GasStationPriorityEnum.fast:

                const maxFeeFastGwey = ethers.utils.parseUnits(
                    Math.ceil(estimatedGas.data.fast.maxFee) + '',
                    'gwei'
                );

                const maxPriorityFastFeeGwey = ethers.utils.parseUnits(
                    Math.ceil(estimatedGas.data.fast.maxPriorityFee)+'',
                    'gwei'
                );

                result = {
                    maxFeePerGas: maxFeeFastGwey,
                    maxPriorityFeePerGas: maxPriorityFastFeeGwey,
                };
                break;
            case GasStationPriorityEnum.safeLow:

                const maxFeeLowGwey = ethers.utils.parseUnits(
                    Math.ceil(estimatedGas.data.safeLow.maxFee) + '',
                    'gwei'
                );

                const maxPriorityLowFeeGwey = ethers.utils.parseUnits(
                    Math.ceil(estimatedGas.data.safeLow.maxPriorityFee)+'',
                    'gwei'
                );

                result = {
                    maxFeePerGas: maxFeeLowGwey,
                    maxPriorityFeePerGas: maxPriorityLowFeeGwey,
                };
                break;
            default:

                const maxFeeStandandGwey = ethers.utils.parseUnits(
                    Math.ceil(estimatedGas.data.standard.maxFee) + '',
                    'gwei'
                );

                const maxPriorityStandandFeeGwey = ethers.utils.parseUnits(
                    Math.ceil(estimatedGas.data.standard.maxPriorityFee)+'',
                    'gwei'
                );

                result = {
                    maxFeePerGas: maxFeeStandandGwey,
                    maxPriorityFeePerGas: maxPriorityStandandFeeGwey,
                };
                break;
        }

        return result;
    }
}