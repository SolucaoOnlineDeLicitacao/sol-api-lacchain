import { ApiProperty } from "@nestjs/swagger";
import { TutorialLocationEnum } from "../../enums/tutorial-location.enum";
import { TutorialTypeEnum } from "../../enums/tutorial-type.enum";

export abstract class TutorialCreateDto {

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: TutorialLocationEnum })
    screenLocation: TutorialLocationEnum;

    @ApiProperty({ enum: TutorialTypeEnum })
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
