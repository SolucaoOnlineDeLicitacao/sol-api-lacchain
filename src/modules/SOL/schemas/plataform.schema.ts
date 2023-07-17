import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: Plataform.name.toLowerCase() })
export class Plataform {


  @Prop({ required: false, type: String })
  start_at: string;

  @Prop({ required: true, type: String })
  end_at: string;


}

export const PlataformSchema = SchemaFactory.createForClass(Plataform);
