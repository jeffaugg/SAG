import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFiles,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { S3_SERVICE } from 'src/common/constants';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { activeUserId } from 'src/shared/decorators/activeUserId';
import {
    currentOrganization,
    OrganizationGuard,
} from 'src/shared/decorators/currentOrganization';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { isPublic } from 'src/shared/decorators/isPublic';
import { PdfFiles } from 'src/shared/decorators/pdf-files';
import { S3Service } from 'src/shared/upload/s3.service';
import { Readable } from 'stream';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';
import { IAtendimentosService } from './interface/atendimentos-service.interface';

@Controller('atendimentos')
export class AtendimentosController {
    constructor(
        @Inject('ATENDIMENTOS_SERVICE')
        private readonly atendimentosService: IAtendimentosService,
        @Inject(S3_SERVICE)
        private readonly s3: S3Service,
    ) {}

    @Post()
    @PdfFiles('file', 5, 10)
    @UseGuards(OrganizationGuard)
    create(
        @Body() createAtendimentoDto: CreateAtendimentoDto,
        @UploadedFiles() files: Express.Multer.File[],
        @activeUserId() userId: string,
        @currentOrganization()
        orgInfo: {
            ubsId: string | null;
            policlinicaId: string | null;
        },
    ) {
        const { ubsId, policlinicaId } = orgInfo;
        return this.atendimentosService.create(
            {
                ...createAtendimentoDto,
                medicoId: userId,
                ubsId: ubsId,
                policlinicaId: policlinicaId,
            },
            files,
        );
    }

    @isPublic()
    @Get('pdf/:url')
    async streamPdf(@Param('url') url: string, @Res() res: Response) {
        let stream: Readable;
        try {
            stream = await this.s3.getFileStream(url);
        } catch {
            throw new NotFoundException('Arquivo não encontrado');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${url}.pdf"`);
        stream.pipe(res);
    }

    @Get()
    @IsPaginated()
    findAll(@Query() paginacaoDto: PaginacaoDto) {
        return this.atendimentosService.findAll(paginacaoDto);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.atendimentosService.findById(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAtendimentoDto: UpdateAtendimentoDto,
    ) {
        return this.atendimentosService.update(id, updateAtendimentoDto);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string) {
        return this.atendimentosService.remove(id);
    }

    @Get('gestacao/:gestacaoId')
    @IsPaginated()
    findByGestacaoId(
        @Param('gestacaoId') gestacaoId: string,
        @Query() paginacaoDto: PaginacaoDto,
    ) {
        return this.atendimentosService.findByGestacaoId(
            gestacaoId,
            paginacaoDto,
        );
    }
}
