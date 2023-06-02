import { Document } from "mongoose";
import { TutorialLocationEnum } from "../enums/tutorial-location.enum";
import { TutorialTypeEnum } from "../enums/tutorial-type.enum";
import { UserInterface } from "./user.interface";

export interface TutorialInterface extends Document {

    readonly name: string;
    readonly screenLocation: TutorialLocationEnum;
    readonly screenBlock: boolean;
    readonly type: TutorialTypeEnum;
    readonly question: string;
    readonly alternatives: string[];
    readonly correctAnswer: string;
    readonly text: string;
    readonly videoLink: string;
    readonly usersWhoCompleted: UserInterface[];

}
