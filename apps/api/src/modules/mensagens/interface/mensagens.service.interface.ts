import { CreateMessageDto } from '../dto/create-message';
import { Mensagem } from '../mensagem';

export interface IMensagensService {
  create(createDto: CreateMessageDto, userId: string): Promise<Mensagem>;
}
