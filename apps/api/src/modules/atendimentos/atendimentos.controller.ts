import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    Query,
    HttpCode,
} from '@nestjs/common';
import { IAtendimentosService } from './interface/atendimentos-service.interface';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';
import { IsAdm } from 'src/shared/decorators/isAdm';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';

@Controller('atendimentos')
export class AtendimentosController {
    constructor(
        @Inject('ATENDIMENTOS_SERVICE')
        private readonly atendimentosService: IAtendimentosService,
    ) {}

    @Post()
    create(@Body() createAtendimentoDto: CreateAtendimentoDto) {
        return this.atendimentosService.create(createAtendimentoDto);
    }

    @Get()
    @IsPaginated()
    @IsAdm()
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
