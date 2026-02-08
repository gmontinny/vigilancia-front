// Template Literal Types para rotas tipadas
export type ApiEndpoint = 
  | '/api/auth/login'
  | '/api/auth/refresh'
  | '/auth/password/forgot'
  | '/auth/password/reset'
  | '/auth/pre-cadastro'
  | '/usuarios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiRoute<T extends ApiEndpoint> = `${HttpMethod} ${T}`;

// Discriminated Unions para respostas da API
export type ApiResponse<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ApiError };

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Template Literal Types para status
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';
export type StatusMessage<T extends EntityStatus> = `Status: ${T}`;

// Variadic Tuple Types para paginação
export type PaginatedResponse<T extends readonly unknown[]> = {
  data: T;
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

// Utility Types Avançados
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Discriminated Union para diferentes tipos de usuário
export type UserRole = 'admin' | 'fiscal' | 'usuario' | 'gestor';

export type UserByRole = 
  | { role: 'admin'; permissions: 'all'; canManageUsers: true }
  | { role: 'fiscal'; permissions: readonly string[]; canInspect: true }
  | { role: 'usuario'; permissions: readonly string[]; canView: true }
  | { role: 'gestor'; permissions: readonly string[]; canApprove: true };

// Template Literal Types para eventos do sistema
export type EntityType = 'estabelecimento' | 'licenca' | 'processo' | 'fiscal';
export type ActionType = 'created' | 'updated' | 'deleted' | 'archived';
export type SystemEvent = `${EntityType}:${ActionType}`;

// Conditional Types para validação
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Mapped Types com Template Literals
export type FormErrors<T> = {
  [K in keyof T as `${string & K}Error`]?: string;
};
