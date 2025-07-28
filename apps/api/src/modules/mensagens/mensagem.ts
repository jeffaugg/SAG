
// Importa decoradores do Mongoose/NestJS e tipos auxiliares
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TipoMensagem } from './entidade/tipo.mensagem';

export type MensagemDocument = HydratedDocument<Mensagem>;

@Schema({ collection: 'mensagens' })
export class Mensagem {
    /**
     * Tipo da mensagem (TEXTO ou MIDIA)
     */
    @Prop({ required: true, enum: TipoMensagem })
    tipo: TipoMensagem;

    /**
     * ID do usuário remetente
     */
    @Prop({ required: true })
    remetente: string;

    /**
     * ID da gestação relacionada à mensagem
     */
    @Prop({ required: true })
    gestacao: string;

    /**
     * Conteúdo da mensagem (texto e/ou imagem)
     */
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


// Cria o schema do Mongoose para a classe Mensagem
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const MensagemSchema = SchemaFactory.createForClass(Mensagem);
