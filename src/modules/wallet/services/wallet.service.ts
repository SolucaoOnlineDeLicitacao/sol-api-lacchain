import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import { SecurityService } from 'src/shared/services/security.service';
import { WalletInterface } from 'src/shared/interfaces/wallet.interface';

@Injectable()
export class WalletService {

    constructor(
        private readonly _securityService: SecurityService,
    ) { }

    async create(): Promise<WalletInterface> {
        const wallet = ethers.Wallet.createRandom();
        return {
            address: wallet.address,
            privateKey: this._securityService.encrypt(wallet.privateKey),
        };
    }
}