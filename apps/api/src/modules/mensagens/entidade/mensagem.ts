import { ConteudoMensagem } from './conteudo.mensagem';

export class Mensagem {
  private id: string;
  private conteudo: ConteudoMensagem;
  constructor(id: string, conteudo: ConteudoMensagem) {
    this.id = id;
    this.conteudo = conteudo;
  }
}
