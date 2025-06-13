import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    HttpCode,
    Inject,
} from '@nestjs/common';
import { CreatePoliclinicaDto } from './dto/create-policlinica.dto';
import { UpdatePoliclinicaDto } from './dto/update-policlinica.dto';
import { IsAdm } from 'src/shared/decorators/isAdm';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IPoliclinicasService } from './interface/policlinica-service.interface';
import { POLICLINICAS_SERVICE } from 'src/common/constants';

@Controller('policlinicas')
export class PoliclinicasController {
    constructor(
        @Inject(POLICLINICAS_SERVICE)
        private readonly policlinicasService: IPoliclinicasService,
    ) {}

    @Post()
    @IsAdm()
    create(@Body() createPoliclinicaDto: CreatePoliclinicaDto) {
        return this.policlinicasService.create(createPoliclinicaDto);
    }

    @Get()
    @IsAdm()
    @IsPaginated()
    findAll(@Query() paginacaoDto: PaginacaoDto) {
        return this.policlinicasService.findAll(paginacaoDto);
    }

    @Get(':id')
    @IsAdm()
    findOne(@Param('id') id: string) {
        return this.policlinicasService.findOne(id);
    }

    @Put(':id')
    @IsAdm()
    update(
        @Param('id') id: string,
        @Body() updatePoliclinicaDto: UpdatePoliclinicaDto,
    ) {
        return this.policlinicasService.update(id, updatePoliclinicaDto);
    }

    @Delete(':id')
    @IsAdm()
    @HttpCode(204)
    remove(@Param('id') id: string) {
        return this.policlinicasService.remove(id);
    }

    @Post(':id/usuarios/:usuarioId')
    @IsAdm()
    createUser(@Param('id') id: string, @Param('usuarioId') usuarioId: string) {
        return this.policlinicasService.createUser(usuarioId, id);
    }

    @Get(':cns/usuarios')
    @IsAdm()
    @IsPaginated()
    listUsers(@Param('cns') cns: string, @Query() paginacaoDto: PaginacaoDto) {
        return this.policlinicasService.listUsers(cns, paginacaoDto);
    }
}
