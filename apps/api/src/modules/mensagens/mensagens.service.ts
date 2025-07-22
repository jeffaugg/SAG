import { Model } from 'mongoose';
import { Mensagem, MensagemDocument } from './mensagem';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message';
import { GetMessagesResponse } from './dto/get-messages-reponse';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MensagensService {
    constructor(
        @InjectModel(Mensagem.name)
        private readonly mensagemModel: Model<MensagemDocument>,
    ) {}

    async create(
        createDto: CreateMessageDto,
        userId: string,
    ): Promise<Mensagem> {
        const message = new this.mensagemModel({
            ...createDto,
            remetente: userId,
        });
        return message.save();
    }

    async findByGestacao(
        gestacaoId: string,
        options: PaginacaoDto,
    ): Promise<GetMessagesResponse> {
        const { limit, skip } = options;

        const [data, total] = await Promise.all([
            this.mensagemModel
                .find({ gestacao: gestacaoId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.mensagemModel.countDocuments({ gestacao: gestacaoId }).exec(),
        ]);
        return {
            items: data,
            total,
        };
    }
}
