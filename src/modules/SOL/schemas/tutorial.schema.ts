import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TutorialLocationEnum } from '../enums/tutorial-location.enum';
import { TutorialTypeEnum } from '../enums/tutorial-type.enum';
import { User } from './user.schema';

@Schema({ timestamps: true, collection: Tutorial.name.toLowerCase() })
export class Tutorial {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String, unique: true, enum: TutorialLocationEnum })
    screenLocation: TutorialLocationEnum;

    @Prop()
    screenBlock: boolean;

    @Prop({ required: true, type: String })
    type: TutorialTypeEnum;

    @Prop({ required: false, type: String })
    question: string;

    @Prop({ required: false, type: [String] })
    alternatives: string[];

    @Prop({ required: false, type: String })
    correctAnswer: string;

    @Prop({ required: false, type: String })
    text: string;

    @Prop({ required: false, type: String })
    videoLink: string;

    @Prop({ required: false, type: [{ type: Types.ObjectId, ref: User.name }] })
    usersWhoCompleted: User[];

}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);
