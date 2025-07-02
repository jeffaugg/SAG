import { Module } from '@nestjs/common';
import { PoliclinicasService } from './policlinicas.service';
import { PoliclinicasController } from './policlinicas.controller';
import { POLICLINICAS_SERVICE } from 'src/common/constants';

@Module({
    controllers: [PoliclinicasController],
    providers: [
        {
            provide: POLICLINICAS_SERVICE,
            useClass: PoliclinicasService,
        },
    ],
})
export class PoliclinicasModule {}
