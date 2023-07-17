import { ApiProperty } from "@nestjs/swagger";
import { ModelContractClassificationEnum } from "../enums/modelContract-classification.enum";

export abstract class CreateDocumentRequestDto {
  @ApiProperty({type: String, required: true, description: 'Nome do documento'})
  language: string;

  @ApiProperty({type: String, enum:ModelContractClassificationEnum, required: true})
  type: ModelContractClassificationEnum;
}