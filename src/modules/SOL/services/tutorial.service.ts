import { TutorialInterface } from '../interfaces/tutorial.interface';
import { Injectable } from "@nestjs/common";
import { TutorialLocationEnum } from "../enums/tutorial-location.enum";
import { TutorialRepository } from "../repositories/tutorial.repository";

@Injectable()
export class TutorialService {

    constructor(
        private readonly _tutorialRepository: TutorialRepository<TutorialInterface>,
    ) { }

    async getByScreenLocationWithUserId(screenLocation: TutorialLocationEnum) {
        return await this._tutorialRepository.getByScreenLocation(screenLocation);
    }

    async addCompletion(id: string, userId: string) {
        return await this._tutorialRepository.addCompletion(id, userId);
    }

}
