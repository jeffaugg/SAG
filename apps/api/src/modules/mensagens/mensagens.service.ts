// Importações necessárias para manipulação de mensagens e integração com o Mongoose
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { CreateMessageDto } from './dto/create-message';
import { GetMessagesResponse } from './dto/get-messages-reponse';
import { Mensagem, MensagemDocument } from './mensagem';

/**
 * Serviço responsável pela lógica de negócio relacionada às mensagens.
 * Utiliza o Mongoose para persistência e consulta dos dados.
 */
@Injectable()
export class MensagensService {
    /**
     * Injeta o modelo do Mongoose para manipulação da coleção de mensagens.
     */
    constructor(
        @InjectModel(Mensagem.name)
        private readonly mensagemModel: Model<MensagemDocument>,
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: IUsuarioRepository,
    ) {}

    /**
     * Cria uma nova mensagem no banco de dados.
     * @param createDto Dados da mensagem a ser criada
     * @param userId ID do usuário remetente
     * @returns Mensagem criada
     */
    async create(
        createDto: CreateMessageDto,
        userId: string,
    ): Promise<Mensagem> {
        // Cria uma nova instância do documento Mensagem
        const message = new this.mensagemModel({
            ...createDto,
            remetente: userId,
        });
        // Salva a mensagem no banco de dados
        return message.save();
    }

    /**
     * Busca mensagens de uma gestação específica, com paginação.
     * @param gestacaoId ID da gestação
     * @param options Parâmetros de paginação (limit, skip)
     * @returns Lista paginada de mensagens e total de registros
     */
    async findByGestacao(
        gestacaoId: string,
        options: PaginacaoDto,
    ): Promise<GetMessagesResponse> {
        const { limit, skip } = options;

        // Busca as mensagens e o total de registros em paralelo
        const [mensagens, total] = await Promise.all([
            this.mensagemModel
                .find({ gestacao: gestacaoId })
                .sort({ createdAt: -1 }) // Ordena por data de criação (mais recentes primeiro)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.mensagemModel.countDocuments({ gestacao: gestacaoId }).exec(),
        ]);

        // Busca informações dos usuários para cada mensagem
        const mensagensComUsuario = await Promise.all(
            mensagens.map(async (mensagem) => {
                const usuario = await this.usuarioRepo.findById(
                    mensagem.remetente,
                );
                return {
                    ...mensagem.toObject(),
                    remetenteNome: usuario?.nome || 'Usuário não encontrado',
                };
            }),
        );

        return {
            items: mensagensComUsuario,
            total,
        };
    }
}
