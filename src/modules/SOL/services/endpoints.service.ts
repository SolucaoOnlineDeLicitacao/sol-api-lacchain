import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { EndPointsModel } from "../models/endpoints.model";
import { EndPointsInterface } from "../interfaces/endpoits.interface";
import { EndPointsRepository } from "../repositories/endpoints.repository";
import { CronJob } from "cron";
import { AssociationService } from "./association.service";
import { EndPointsTypeEnum } from "../enums/endpoints-type.enum";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { EndPointsStatusEnum } from "../enums/endpoints-status.enum";
import { AgreementService } from "./agreement.service";
import { CostItemsService } from "./cost-items.service";

@Injectable()
export class EndPointsService {
  private readonly _logger = new Logger(EndPointsService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private endpointsRepository: EndPointsRepository,
    private associationService: AssociationService,
    private httpService: HttpService,
    private agreementService:AgreementService,
    private costItemsService:CostItemsService
  ) {
    this.initAllJobs();
  }

  async createEndpoint(endpoint: EndPointsInterface): Promise<EndPointsModel> {
    const old = await this.endpointsRepository.getByEndpointType(endpoint.endpointType);
    if (old) {
      throw new BadRequestException('Já existe um endpoint com esse tipo!');
    }

    const newEndpoint = await this.endpointsRepository.register(endpoint);

    if (!newEndpoint) return null;

    const job = new CronJob(endpoint.frequency, async () => {
      this._logger.debug(`Running endpoint${endpoint.endpointType} :${endpoint.endpointPath}`);
      return this.dynamicJob(endpoint.endpointType);
    });

    this.schedulerRegistry.addCronJob(endpoint.endpointType, job);
    this.schedulerRegistry.getCronJob(endpoint.endpointType).start();

    return newEndpoint;
  }

  async listEndpoints(): Promise<EndPointsModel[]> {
    return await this.endpointsRepository.list();
  }

  async getEndpointById(_id: string): Promise<EndPointsModel> {
    return await this.endpointsRepository.getById(_id);
  }

  async updateEndpoint(_id: string, endpoint: EndPointsInterface): Promise<EndPointsModel> {
    endpoint.status = EndPointsStatusEnum.stopped;
    const result = await this.endpointsRepository.update(_id, endpoint);
    if (!result){
      throw new BadRequestException('Não foi possivel atualizar esse endpoint!');
    }
    if(this.schedulerRegistry.doesExist("cron",result.endpointType))
      this.schedulerRegistry.deleteCronJob(result.endpointType);

    const job = new CronJob(endpoint.frequency, async () => {
      this._logger.debug(`Running endpoint ${endpoint.endpointType} :${endpoint.endpointPath}`);
      return this.dynamicJob(endpoint.endpointType);
    });

    this.schedulerRegistry.addCronJob(result.endpointType, job);
    this.schedulerRegistry.getCronJob(endpoint.endpointType).start();

    return result;
  }

  async deleteEndpointById(_id: string) {
    const endpoint = await this.endpointsRepository.getById(_id);
    if (!endpoint){
      throw new BadRequestException('Não foi possivel deletar esse endpoint!');
    }

    this.schedulerRegistry.deleteCronJob(endpoint.endpointType);

    return await this.endpointsRepository.deleteById(_id);
  }


  async dynamicJob(type:EndPointsTypeEnum) {
    const endpoint = await this.endpointsRepository.getByEndpointType(type);
    endpoint.lastRun = new Date();
    endpoint.status = EndPointsStatusEnum.running;
    await this.endpointsRepository.update(endpoint._id, endpoint);
    try {
      const result = await firstValueFrom(this.httpService.get(endpoint.endpointPath));
      if (result.data) {
        endpoint.status = EndPointsStatusEnum.success;
        await this.endpointsRepository.update(endpoint._id, endpoint);
        if(type === EndPointsTypeEnum.association)
          return await this.associationService.handlerJob(result.data);
        if(type === EndPointsTypeEnum.agreement)
          return await this.agreementService.handlerJob(result.data);
        if(type === EndPointsTypeEnum.costItems)
          return await this.costItemsService.handlerJob(result.data);
      }
      endpoint.status = EndPointsStatusEnum.error;
      endpoint.messageError = 'Não foi possivel obter os dados do endpoint';
      await this.endpointsRepository.update(endpoint._id, endpoint);
      return;
    } catch (error) {
      endpoint.status = EndPointsStatusEnum.error;
      endpoint.messageError = error;
      this._logger.error(error);
      await this.endpointsRepository.update(endpoint._id, endpoint);
    }
  }

  async initAllJobs() {
    this._logger.debug('EndpointsService initialized');
    const endpoints = await this.endpointsRepository.list();
    endpoints.forEach((endpoint) => {
      const job = new CronJob(endpoint.frequency, async () => {
        this._logger.debug(`Running endpoint ${endpoint.endpointType} :${endpoint.endpointPath}`);
        return this.dynamicJob(endpoint.endpointType);
      });

      this.schedulerRegistry.addCronJob(endpoint.endpointType, job);
      this.schedulerRegistry.getCronJob(endpoint.endpointType).start();
    });
  }

}
