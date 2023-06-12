import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TutorialLocationEnum } from "../enums/tutorial-location.enum";
import { Tutorial } from "../schemas/tutorial.schema";

@Injectable()
export class TutorialRepository<TutorialInterface> {

  constructor(
    @InjectModel(Tutorial.name) private readonly model: Model<TutorialInterface>,
  ) { }

  async getByScreenLocationWithoutUserId(screenLocation: TutorialLocationEnum, userId: string) {
    return await this.model.findOne({
      screenLocation,
      usersWhoCompleted: {
        $nin: [userId]
      }
    });
  }

  async getByScreenLocation(screenLocation: TutorialLocationEnum) {
    return this.model.findOne({
      screenLocation
    });
  }

  async addCompletion(id: string, userId: string) {
    return await this.model.findByIdAndUpdate(id, {
      //@ts-ignore
      $push: {
        usersWhoCompleted: userId
      }
    });
  }

  async delete(_id: string): Promise<void> {
    await this.model.deleteOne({
      id: _id
    });
  }
}
