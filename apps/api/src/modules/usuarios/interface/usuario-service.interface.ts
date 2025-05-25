export interface IUsuariosService {
  getUsuariosById(id: string): Promise<{
    id: string;
    name: string;
    cargo: string;
    cpf: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
