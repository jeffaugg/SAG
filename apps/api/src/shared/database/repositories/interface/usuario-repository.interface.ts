import { Prisma } from '@prisma/client';
import { Usuario } from '@prisma/client';

export interface IUsuarioRepository {
  create(args: Prisma.UsuarioCreateArgs): Promise<Usuario>;
  findByCpf(cpf: string): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
}
