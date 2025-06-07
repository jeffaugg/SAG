import { Cargo, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';

export const UsuarioMock = (): Prisma.UsuarioUncheckedCreateInput => {
    return {
        nome: faker.person.fullName(),
        cargo: faker.helpers.arrayElement([
            Cargo.ADM,
            Cargo.Enfermeiro,
            Cargo.Medico,
        ]),
        cpf: faker.string.numeric({ length: 11 }),
        senha: faker.internet.password(),
    };
};

export const PoliclinicaMock = (): Prisma.PoliclinicaUncheckedCreateInput => {
    return {
        id: faker.string.uuid(),
        contato: faker.phone.number({ style: 'international' }),
        nome: faker.person.firstName(),
        localizacao: faker.location.city(),
        cnes: faker.string.uuid(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        deletedAt: null,
    };
};
