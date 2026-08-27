import {
    Body,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MENSAGENS_SERVICE, S3_SERVICE } from 'src/common/constants';
import { S3Service } from 'src/shared/upload/s3.service';
import { Readable } from 'stream';

import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { activeUserId } from 'src/shared/decorators/activeUserId';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { isPublic } from 'src/shared/decorators/isPublic';
import { CreateMessageDto } from './dto/create-message';
import { CreateMessageWithFileDto } from './dto/create-message-with-file.dto';
import { IMensagensService } from './interface/mensagens.service.interface';

/**
 * Controller responsável pelo gerenciamento das mensagens.
 * Define as rotas para criação e busca de mensagens relacionadas a uma gestação.
 */
@Controller('mensagens')
export class MensagensController {
    /**
     * Injeta o serviço de mensagens via token de provider.
     */
    constructor(
        @Inject(MENSAGENS_SERVICE)
        private readonly mensagensService: IMensagensService,
        @Inject(S3_SERVICE)
        private readonly s3Service: S3Service,
    ) {}

    /**
     * Cria uma nova mensagem.
     * @param dto Dados da mensagem a ser criada (validados pelo DTO)
     * @param userId ID do usuário remetente (extraído do contexto do usuário ativo)
     * @returns Mensagem criada
     */
    @Post()
    async create(
        @Body() dto: CreateMessageDto,
        @activeUserId() userId: string,
    ) {
        return this.mensagensService.create(dto, userId);
    }

    @Post('with-file')
    @UseInterceptors(FileInterceptor('file'))
    async createWithFile(
        @Body() dto: CreateMessageWithFileDto,
        @UploadedFile() file: Express.Multer.File,
        @activeUserId() userId: string,
    ) {
        let imagemUrl: string | undefined;
        let arquivoUrl: string | undefined;

        if (file) {
            const isImage = file.mimetype.startsWith('image/');
            if (isImage) {
                imagemUrl = await this.s3Service.uploadFile(file);
            } else {
                arquivoUrl = await this.s3Service.uploadFile(file);
            }
        }

        const messageDto: CreateMessageDto = {
            gestacao: dto.gestacao,
            tipo: dto.tipo,
            conteudo: {
                texto: dto.texto || '',
                imagemUrl,
                arquivoUrl,
            },
        };

        return this.mensagensService.create(messageDto, userId);
    }

    @Get('file/:url')
    @isPublic()
    async streamFile(@Param('url') url: string, @Res() res: Response) {
        let stream: Readable;
        try {
            stream = await this.s3Service.getFileStream(url);
        } catch {
            throw new NotFoundException('Arquivo não encontrado');
        }

        const mimeType = this.getMimeType(url);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        stream.pipe(res);
    }

    private getMimeType(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            pdf: 'application/pdf',
        };
        return mimeTypes[ext || ''] || 'application/octet-stream';
    }

    /**
     * Busca mensagens paginadas de uma gestação específica.
     * @param gestacaoId ID da gestação
     * @param paginacaoDto Parâmetros de paginação
     * @returns Lista paginada de mensagens
     */
    @Get(':gestacaoId')
    @IsPaginated() // Decorator customizado para habilitar paginação automática
    async findByGestacao(
        @Param('gestacaoId') gestacaoId: string,
        @Query() paginacaoDto: PaginacaoDto,
    ) {
        const resultado = await this.mensagensService.findByGestacao(
            gestacaoId,
            paginacaoDto,
        );

        return resultado;
    }
}
