import { LanguageContractEnum } from "../enums/language-contract.enum";
import { ModelContractStatusEnum } from "../enums/model-contract-status.enum";
import { ModelContractClassificationEnum } from "../enums/modelContract-classification.enum";

export abstract class ModelContractInterface {
  readonly name: string;
  readonly status: ModelContractStatusEnum;
  readonly classification: ModelContractClassificationEnum;
  readonly contract: string;
  readonly language: LanguageContractEnum;
}
