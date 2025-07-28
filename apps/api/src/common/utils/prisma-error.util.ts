// Importa exceções do NestJS e tipo de erro do Prisma
import {
    ConflictException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/**
 * Função utilitária para tratar erros conhecidos do Prisma e lançar exceções HTTP apropriadas
 * @param error Erro retornado pelo Prisma
 */
export function handlePrismaError(error: unknown): never {
    // Verifica se o erro é um erro conhecido do Prisma
    if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
            // Código P2002: violação de campo único
            case 'P2002':
                throw new ConflictException('Campo único já cadastrado');
            // Código P2025: registro não encontrado
            case 'P2025':
                throw new NotFoundException('Registro não encontrado');
        }
    }
    // Para outros erros, loga e lança erro interno do servidor
    console.error('Prisma error:', error);
    throw new InternalServerErrorException();
}
