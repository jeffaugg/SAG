import { Module } from '@nestjs/common';
import { UbsController } from './ubs.controller';
import { UbsService } from './ubs.service';
import { UbsRepository } from 'src/shared/database/repositories/ubs.repositories';
import { UBS_SERVICE, UBS_REPOSITORY } from 'src/common/constants';

@Module({
  controllers: [UbsController],
  providers: [
    { provide: UBS_SERVICE, useClass: UbsService },
    { provide: UBS_REPOSITORY, useClass: UbsRepository },
  ],
})
export class UbsModule {}
