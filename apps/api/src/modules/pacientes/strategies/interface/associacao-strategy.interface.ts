import { OrganizacaoInfo } from 'src/shared/types';
import { Paciente } from '@prisma/client';

export interface IAssociacaoStrategy {
    association(paciente: Paciente, orgInfo: OrganizacaoInfo): Promise<void>;
    forwarding(cnes: string, pacienteCpf: string): Promise<void>;
}
