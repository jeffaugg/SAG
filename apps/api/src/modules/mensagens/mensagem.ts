import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TipoMensagem } from './entidade/tipo.mensagem';

export type MensagemDocument = HydratedDocument<Mensagem>;

@Schema()
export class Mensagem {
  @Prop({ required: true, enum: TipoMensagem })
  tipo: TipoMensagem;

  @Prop({
    type: {
      texto: String,
      imagemUrl: String,
    },
  })
  conteudo: {
    texto: string;
    imagemUrl?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const MensagemSchema = SchemaFactory.createForClass(Mensagem);
