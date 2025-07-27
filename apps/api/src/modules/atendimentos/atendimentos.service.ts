import { Inject, Injectable } from '@nestjs/common';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';
import { catchError } from 'src/shared/erro/catch-errors';
import {
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { IAtendimentoRepository } from 'src/shared/database/repositories/interface/atendimento-repository.interface';
import { IAtendimentosService } from './interface/atendimentos-service.interface';
import { ATENDIMENTOS_REPOSITORY, S3_SERVICE } from 'src/common/constants';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { S3Service } from 'src/shared/upload/s3.service';

@Injectable()
export class AtendimentosService implements IAtendimentosService {
    constructor(
        @Inject(ATENDIMENTOS_REPOSITORY)
        private readonly atendimentoRepository: IAtendimentoRepository,
        @Inject(S3_SERVICE)
        private readonly s3Service: S3Service,
    ) {}
    async create(
        dto: CreateAtendimentoDto & {
            medicoId: string;
            ubsId: string | null;
            policlinicaId: string | null;
        },
        files: Express.Multer.File[],
    ): Promise<any> {
        const urls = await Promise.all(
            files ? files.map((file) => this.s3Service.uploadFile(file)) : [],
        );

        const [erro, atendimento] = await catchError(
            this.atendimentoRepository.create(dto, urls),
        );
        if (erro) console.error('Erro ao criar atendimento:', erro);

        return { ...atendimento, urls };
    }

    findAll(options: PaginacaoDto) {
        return this.atendimentoRepository.findAll(options);
    }

    async findById(id: string): Promise<any> {
        try {
            const att = await this.atendimentoRepository.findById(id);
            if (!att) throw new NotFoundException('Atendimento não encontrado');
            return att;
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException();
        }
    }

    async update(id: string, dto: UpdateAtendimentoDto): Promise<any> {
        try {
            return await this.atendimentoRepository.update(id, dto);
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException();
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.atendimentoRepository.delete(id);
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException();
        }
    }

    async findByGestacaoId(gestacaoId: string, options: PaginacaoDto) {
        return this.atendimentoRepository.findByGestacaoId(gestacaoId, options);
    }
}
