import { ApiProperty } from "@nestjs/swagger";
import { TutorialLocationEnum } from "../../enums/tutorial-location.enum";
import { TutorialTypeEnum } from "../../enums/tutorial-type.enum";

export abstract class TutorialUpdateDto {

    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ enum: TutorialLocationEnum, required: false })
    screenLocation: TutorialLocationEnum;

    @ApiProperty({ enum: TutorialTypeEnum, required: false })
    type: TutorialTypeEnum;

    @ApiProperty({ required: false })
    question: string;

    @ApiProperty({ required: false, type: [String] })
    alternatives: string[];

    @ApiProperty({ required: false })
    correctAnswer: string;

    @ApiProperty({ required: false })
    text: string;

    @ApiProperty({ required: false })
    videoLink: string;

}
