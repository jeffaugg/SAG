import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TipoMensagem } from './entidade/tipo.mensagem';

export type MensagemDocument = HydratedDocument<Mensagem>;

@Schema({ collection: 'mensagens' })
export class Mensagem {
  @Prop({ required: true, enum: TipoMensagem })
  tipo: TipoMensagem;

  @Prop({ required: true })
  remetente: string;

  @Prop({ required: true })
  gestacao: string;

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
