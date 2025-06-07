// tipos/body-texto.ts
import { ConteudoMensagem } from './conteudo.mensagem';
import { TipoMensagem } from './tipo.mensagem';

export class BodyTexto extends ConteudoMensagem {
  tipo = TipoMensagem.TEXTO;

  constructor(public texto: string) {
    super();
  }
}
