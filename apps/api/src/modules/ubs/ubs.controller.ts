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
import { CreateUbsDto } from './dto/create-ubs.dto';
import { UpdateUbsDto } from './dto/update-ubs.dto';
import { IsAdm } from 'src/shared/decorators/isAdm';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IUbsService } from './interface/ubs-service.interface';
import { UBS_SERVICE } from 'src/common/constants';

@Controller('ubs')
export class UbsController {
  constructor(
    @Inject(UBS_SERVICE)
    private readonly ubsService: IUbsService,
  ) {}

  @Post()
  @IsAdm()
  create(@Body() dto: CreateUbsDto) {
    return this.ubsService.create(dto);
  }

  @Get()
  @IsAdm()
  @IsPaginated()
  findAll(@Query() paginacaoDto: PaginacaoDto) {
    return this.ubsService.findAll(paginacaoDto);
  }

  @Get(':id')
  @IsAdm()
  findOne(@Param('id') id: string) {
    return this.ubsService.findOne(id);
  }

  @Put(':id')
  @IsAdm()
  update(@Param('id') id: string, @Body() dto: UpdateUbsDto) {
    return this.ubsService.update(id, dto);
  }

  @Delete(':id')
  @IsAdm()
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.ubsService.remove(id);
  }

  @Post(':id/usuarios/:usuarioId')
  @IsAdm()
  createUser(@Param('id') id: string, @Param('usuarioId') usuarioId: string) {
    return this.ubsService.createUser(usuarioId, id);
  }

  @Get(':cnes/usuarios')
  @IsAdm()
  @IsPaginated()
  listUsers(@Param('cnes') cnes: string, @Query() paginacaoDto: PaginacaoDto) {
    return this.ubsService.listUsers(cnes, paginacaoDto);
  }
}
