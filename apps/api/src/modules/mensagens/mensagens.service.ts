import { Model } from 'mongoose';
import { Mensagem, MensagemDocument } from './mensagem';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message';

@Injectable()
export class MensagensService {
  constructor(
    @InjectModel(Mensagem.name)
    private readonly mensagemModel: Model<MensagemDocument>,
  ) {}

  async create(createDto: CreateMessageDto, userId: string): Promise<Mensagem> {
    const message = new this.mensagemModel({ ...createDto, remetente: userId });
    return message.save();
  }
}
