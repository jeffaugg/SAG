import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { CreateMessageDto } from '../dto/create-message';
import { GetMessagesResponse } from '../dto/get-messages-reponse';
import { Mensagem } from '../mensagem';

export interface IMensagensService {
    create(createDto: CreateMessageDto, userId: string): Promise<Mensagem>;
    findByGestacao(
        gestacaoId: string,
        options: PaginacaoDto,
    ): Promise<GetMessagesResponse>;
}
