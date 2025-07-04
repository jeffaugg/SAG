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

export const UbsMock = (): Prisma.UBSUncheckedCreateInput => {
    return {
        id: faker.string.uuid(),
        contato: faker.phone.number({ style: 'international' }),
        nome: faker.company.name(),
        localizacao: faker.location.streetAddress(),
        cnes: faker.string.numeric(7),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        deletedAt: null,
        usuarioUbs: { create: [] }, // verificar mais tarde se é necessário criar usuários vinculados à UBS
    };
};

export const AtendimentosMock = (): Prisma.AtendimentoUncheckedCreateInput => {
    return {
        id: faker.string.uuid(),
        descricao: faker.lorem.sentence(),
        unidadeId: faker.string.uuid(),
        medicoId: faker.string.uuid(),
        gestacaoId: faker.string.uuid(),
        unidadeType: faker.helpers.arrayElement(['UBS', 'POLICLINICA']),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        deletedAt: null,
    };
};
