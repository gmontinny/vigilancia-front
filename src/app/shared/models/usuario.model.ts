export interface Usuario {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  celular: string;
  imagem?: string;
  sexo: number; // 1=Masculino, 2=Feminino, 3=Outros
  status: number; // 0=Inativo, 1=Ativo
  tipo: number; // 0=Em avaliação, 1=Aprovado
}

export interface CreateUsuarioRequest {
  usuario: Omit<Usuario, 'id'>;
  imagem?: File;
  recaptchaToken?: string;
}

export enum SexoEnum {
  MASCULINO = 1,
  FEMININO = 2,
  OUTROS = 3
}

export enum StatusEnum {
  INATIVO = 0,
  ATIVO = 1
}

export enum TipoEnum {
  EM_AVALIACAO = 0,
  APROVADO = 1
}