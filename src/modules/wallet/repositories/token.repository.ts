import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, ethers } from "ethers";
import { GasStationPriorityEnum } from "src/shared/dtos/gas-station-priority.enum";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";
import { GasStationService } from "src/shared/services/gas-station.service";
import { SecurityService } from "src/shared/services/security.service";
import * as Erc20 from '../../../assets/ERC20MintBurn.json';
import { UserRepository } from "./user.repository";

@Injectable()
export class TokenRepository {

    constructor(
        private readonly _configService: ConfigService,
        private readonly _userRepository: UserRepository,
        private readonly _securityService: SecurityService,
        private readonly _gasStationService: GasStationService,
    ) { }

    private providerEthereum = () => {
        return new ethers.providers.JsonRpcProvider(
            `https://${this._configService.get(EnviromentVariablesEnum.ETHEREUM_NETWORK)}.infura.io/v3/${this._configService.get(EnviromentVariablesEnum.INFURA_PROJECT_ID)}`
        );
    }

    private providerPolygon = () => {
        return new ethers.providers.JsonRpcProvider(
            `https://${this._configService.get(EnviromentVariablesEnum.POLYGON_NETWORK)}.infura.io/v3/${this._configService.get(EnviromentVariablesEnum.INFURA_PROJECT_ID)}`
        );
    }

    private providerBinance = () => {
        return new ethers.providers.JsonRpcProvider(
            this._configService.get(EnviromentVariablesEnum.BINANCE_SMART_CHAIN_NETWORK)
        );
    }

    private async _getUserWallet(_id: string, provider: ethers.providers.JsonRpcProvider) {
        const user = await this._userRepository.getById(_id);
        const wallet = new ethers.Wallet(this._securityService.decypt(user.wallet.privateKey));
        return wallet.connect(provider);
    }

    private async _getSwapWallet(provider: ethers.providers.JsonRpcProvider) {
        const wallet = ethers.Wallet.fromMnemonic(
            this._configService.get(EnviromentVariablesEnum.SWAP_MNEUMONIC)
        );
        return wallet.connect(provider);
    }

    private _unsignedContractInstance = async (tokenAddress: string, provider: ethers.providers.JsonRpcProvider) => {
        return new ethers.Contract(
            tokenAddress,
            Erc20.abi,
            provider,
        );
    };

    private _signedContractInstanceClientWallet = async (tokenAddress: string, userId: string, provider: ethers.providers.JsonRpcProvider) => {
        return new ethers.Contract(
            tokenAddress,
            Erc20.abi,
            await this._getUserWallet(userId, provider),
        );
    };

    private _signedContractInstanceSwapWallet = async (tokenAddress: string, provider: ethers.providers.JsonRpcProvider) => {
        return new ethers.Contract(
            tokenAddress,
            Erc20.abi,
            await this._getSwapWallet(provider),
        );
    };

    async getEthereumGasPrice(): Promise<ethers.BigNumber> {
        const provider = this.providerEthereum();
        return await provider.getGasPrice();
    }

    async getPolygonGasPrice(): Promise<ethers.BigNumber> {
        const provider = this.providerPolygon();
        return await provider.getGasPrice();
    }

    async getBinanceGasPrice(): Promise<ethers.BigNumber> {
        const provider = this.providerBinance();
        return await provider.getGasPrice();
    }

    async getEthBalance(walletAddress: string) {
        const provider = this.providerEthereum();
        const balance = await provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
    }

    async getBNBBalance(walletAddress: string) {
        const provider = this.providerBinance();
        const balance = await provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
    }

    async getMaticBalance(walletAddress: string) {
        const provider = this.providerPolygon();
        const balance = await provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
    }

    async getZIBalance(walletAddress: string) {

        const contractInstance = await this._unsignedContractInstance(
            this._configService.get(EnviromentVariablesEnum.ZI_TOKEN_ADDRESS),
            this.providerPolygon()
        );

        const balance = await contractInstance.balanceOf(walletAddress);

        return ethers.utils.formatEther(balance);
    }

    async getBUSDBalance(walletAddress: string) {

        const contractInstance = await this._unsignedContractInstance(
            this._configService.get(EnviromentVariablesEnum.BUSD_TOKEN_ADDRESS),
            this.providerBinance()
        );

        const balance = await contractInstance.balanceOf(walletAddress);

        return ethers.utils.formatEther(balance);
    }

    async getUSDTBalance(walletAddress: string) {

        const contractInstance = await this._unsignedContractInstance(
            this._configService.get(EnviromentVariablesEnum.USDT_TOKEN_ADDRESS),
            this.providerEthereum()
        );

        const balance = await contractInstance.balanceOf(walletAddress);

        return ethers.utils.formatEther(balance);
    }

    async transferFromCLient(userId: string, to: string, symbol: string, value: BigNumber): Promise<ethers.Transaction> {

        let transaction: ethers.Transaction;

        switch (symbol) {
            case 'ETH':
                transaction = await this._transferEthFromClient(userId, to, value);
                break;
            case 'BNB':
                transaction = await this._transferBnbFromClient(userId, to, value);
                break;
            case 'MATIC':
                transaction = await this._transferMaticFromClient(userId, to, value);
                break;
            case 'BUSD':
                transaction = await this._transferBusdFromClient(userId, to, value);
                break;
            case 'USDT':
                transaction = await this._transferUsdtFromClient(userId, to, value);
                break;
            case 'ZI':
                transaction = await this._transferZiFromClient(userId, to, value);
                break;
            default:
                throw new BadRequestException('invalid token!');
        }

        return transaction;
    }

    private async _transferEthFromClient(userId: string, to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const wallet = await this._getUserWallet(userId, this.providerEthereum());
        const tx = {
            to,
            value,
        };

        return await wallet.sendTransaction(tx);
    }

    private async _transferBnbFromClient(userId: string, to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const wallet = await this._getUserWallet(userId, this.providerBinance());
        const tx = {
            to,
            value,
        };

        return await wallet.sendTransaction(tx);
    }

    private async _transferMaticFromClient(userId: string, to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const wallet = await this._getUserWallet(userId, this.providerPolygon());
        const tx = {
            to,
            value,
        };

        return await wallet.sendTransaction(tx);
    }

    private async _transferBusdFromClient(userId: string, to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const contractInstance = await this._signedContractInstanceClientWallet(
            this._configService.get(EnviromentVariablesEnum.BUSD_TOKEN_ADDRESS),
            userId,
            this.providerBinance(),
        );

        return await contractInstance.transfer(to, value, { gasLimit: 3000000 });
    }

    private async _transferUsdtFromClient(userId: string, to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const contractInstance = await this._signedContractInstanceClientWallet(
            this._configService.get(EnviromentVariablesEnum.USDT_TOKEN_ADDRESS),
            userId,
            this.providerEthereum(),
        );

        return await contractInstance.transfer(to, value, { gasLimit: 3000000 });
    }

    private async _transferZiFromClient(userId: string, to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {

        const contractInstance = await this._signedContractInstanceClientWallet(
            this._configService.get(EnviromentVariablesEnum.ZI_TOKEN_ADDRESS),
            userId,
            this.providerPolygon(),
        );

        const options = await this._gasStationService.getMaticEstimatedFee(GasStationPriorityEnum.standard);

        return await contractInstance.transfer(to, value, options);
    }

    async transferFromSwapWallet(to: string, symbol: string, value: BigNumber): Promise<ethers.Transaction> {

        let transaction: ethers.Transaction;

        switch (symbol) {
            case 'ETH':
                transaction = await this._transferEthFromSwapWallet(to, value);
                break;
            case 'BNB':
                transaction = await this._transferBnbFromSwapWallet(to, value);
                break;
            case 'BUSD':
                transaction = await this._transferBusdFromSwapWallet(to, value);
                break;
            case 'USDT':
                transaction = await this._transferUsdtFromSwapWallet(to, value);
                break;
            case 'ZI':
                transaction = await this._transferZiFromSwapWallet(to, value);
                break;
            case 'MATIC':
                transaction = await this._transferMaticFromSwapWallet(to, value);
                break;
            default:
                throw new BadRequestException('invalid token!');
        }

        return transaction;
    }

    private async _transferEthFromSwapWallet(to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const wallet = await this._getSwapWallet(this.providerEthereum());
        const tx = {
            to,
            value,
        };

        const transactionResponse = await wallet.sendTransaction(tx);
        await transactionResponse.wait();
        return transactionResponse;
    }

    private async _transferBnbFromSwapWallet(to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const wallet = await this._getSwapWallet(this.providerBinance());
        const tx = {
            to,
            value,
        };

        const transactionResponse = await wallet.sendTransaction(tx);
        await transactionResponse.wait();
        return transactionResponse;
    }

    private async _transferMaticFromSwapWallet(to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const wallet = await this._getSwapWallet(this.providerPolygon());
        const tx = {
            to,
            value,
        };

        const transactionResponse = await wallet.sendTransaction(tx);
        await transactionResponse.wait();
        return transactionResponse;
    }

    private async _transferBusdFromSwapWallet(to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const contractInstance = await this._signedContractInstanceSwapWallet(
            this._configService.get(EnviromentVariablesEnum.BUSD_TOKEN_ADDRESS),
            this.providerBinance(),
        );

        const transactionResponse = await contractInstance.transfer(to, value, { gasLimit: 3000000 });
        await transactionResponse.wait();
        return transactionResponse;
    }

    private async _transferUsdtFromSwapWallet(to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {
        const contractInstance = await this._signedContractInstanceSwapWallet(
            this._configService.get(EnviromentVariablesEnum.USDT_TOKEN_ADDRESS),
            this.providerEthereum(),
        );

        const transactionResponse = await contractInstance.transfer(to, value, { gasLimit: 3000000 });
        await transactionResponse.wait();
        return transactionResponse;
    }

    private async _transferZiFromSwapWallet(to: string, value: ethers.BigNumber): Promise<ethers.Transaction> {

        const contractInstance = await this._signedContractInstanceSwapWallet(
            this._configService.get(EnviromentVariablesEnum.ZI_TOKEN_ADDRESS),
            this.providerPolygon(),
        );

        const options = await this._gasStationService.getMaticEstimatedFee(GasStationPriorityEnum.standard);

        const transactionResponse = await contractInstance.transfer(to, value, options);
        await transactionResponse.wait();
        return transactionResponse;
    }
}