// Importa os módulos e tipos necessários do NestJS e do domínio de UBS
import { Module } from '@nestjs/common';
import { UbsController } from './ubs.controller';
import { UbsService } from './ubs.service';
import { UBS_SERVICE } from 'src/common/constants';


// Módulo responsável por agrupar controller e provider de UBS
@Module({
    // Define o controller responsável pelas rotas de UBS
    controllers: [UbsController],
    // Define o provider que injeta a implementação do serviço de UBS
    providers: [{ provide: UBS_SERVICE, useClass: UbsService }],
})
export class UbsModule {}
