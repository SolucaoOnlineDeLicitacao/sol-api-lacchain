import { ApiProperty } from "@nestjs/swagger";
import { ModelContractStatusEnum } from "../enums/model-contract-status.enum";
import { LanguageContractEnum } from "../enums/language-contract.enum";
import { ModelContractClassificationEnum } from "../enums/modelContract-classification.enum";

export abstract class ModelContractRegisterDto {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, enum: ModelContractStatusEnum })
  status: ModelContractStatusEnum;

  @ApiProperty({ enum: ModelContractClassificationEnum })
  classification: ModelContractClassificationEnum;

  @ApiProperty({ type: String })
  contract: string;

  @ApiProperty({ type: String, enum: LanguageContractEnum })
  language: LanguageContractEnum;
}
