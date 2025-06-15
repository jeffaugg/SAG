import { Module } from '@nestjs/common';
import { UbsController } from './ubs.controller';
import { UbsService } from './ubs.service';
import { UBS_SERVICE } from 'src/common/constants';

@Module({
    controllers: [UbsController],
    providers: [{ provide: UBS_SERVICE, useClass: UbsService }],
})
export class UbsModule {}
