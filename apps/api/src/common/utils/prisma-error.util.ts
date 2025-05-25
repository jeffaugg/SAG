import {
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Campo único já cadastrado');
      case 'P2025':
        throw new NotFoundException('Registro não encontrado');
    }
  }
  console.error('Prisma error:', error);
  throw new InternalServerErrorException();
}
