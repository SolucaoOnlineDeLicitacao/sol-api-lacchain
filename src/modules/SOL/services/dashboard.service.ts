import { Injectable, Logger } from "@nestjs/common";
import { BidRepository } from "../repositories/bid.repository";
import { SupplierRepository } from "../repositories/supplier.repository";
import { AssociationRepository } from "../repositories/association.repository";
import { DashboardResponseDto } from "../dtos/dashboard-response.dto";

@Injectable()
export class DashboardService {

    private readonly _logger = new Logger(DashboardService.name);

    constructor(
        private _bidRepository: BidRepository,
        private _supplierRepository: SupplierRepository,
        private _associationRepository: AssociationRepository
    ) { }


    async getData(): Promise<DashboardResponseDto> {
        const bid = await this._bidRepository.listForDashboard();
        const supplier = await this._supplierRepository.list();
        const association = await this._associationRepository.list();

        return new DashboardResponseDto(
            bid.length,
            association.length,
            supplier.length
        )
    }

}