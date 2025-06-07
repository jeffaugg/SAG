import { ConteudoMensagem } from './conteudo.mensagem';
import { TipoMensagem } from './tipo.mensagem';

export class BodyMidia extends ConteudoMensagem {
  tipo = TipoMensagem.MIDIA;

  constructor(
    public urlMidia: string,
    public texto?: string,
  ) {
    super();
  }
}
