import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
const prisma = new PrismaClient();

async function seed() {
    await prisma.usuario.create({
        data: {
            cargo: 'ADM',
            nome: 'Admin User',
            cpf: process.env.ADM_CPF || '',
            senha: await hash(process.env.ADM_PASSWORD || '', 12),
        },
    });
    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
