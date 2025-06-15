import { Injectable } from '@nestjs/common';
import { OrganizacaoInfo } from 'src/shared/types';
import { PrismaService } from 'src/shared/database/prisma.service';
import { Paciente } from '@prisma/client';
import { IAssociacaoStrategy } from './interface/associacao-strategy.interface';

@Injectable()
export class AssociacaoPoliclinicaStrategy implements IAssociacaoStrategy {
    constructor(private readonly prisma: PrismaService) {}

    async association(paciente: Paciente, orgInfo: OrganizacaoInfo) {
        await this.prisma.permissoesPoliclinica.create({
            data: {
                pacienteCpf: paciente.cpf,
                policlinicaCNES: orgInfo.cnes,
            },
        });
    }
}
