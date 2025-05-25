import { SetMetadata } from '@nestjs/common';

export const PAGINATE_KEY = 'paginate';
export const IsPaginated = () => SetMetadata(PAGINATE_KEY, true);
