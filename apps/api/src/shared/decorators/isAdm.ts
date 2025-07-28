import { SetMetadata } from '@nestjs/common';

export const IS_ADM_KEY = 'isAdm';

export const IsAdm = () => SetMetadata(IS_ADM_KEY, true);
