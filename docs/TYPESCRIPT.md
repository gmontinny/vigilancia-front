# TypeScript Avançado

## 🎯 Configuração Strictness

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,                              // ✅ Ativa todos os checks estritos
    "noImplicitAny": true,                       // ✅ Incluído em strict
    "strictNullChecks": true,                    // ✅ Incluído em strict
    "noImplicitReturns": true,                   // ✅ Retornos explícitos
    "noFallthroughCasesInSwitch": true,         // ✅ Switch cases completos
    "noImplicitOverride": true,                  // ✅ Override explícito
    "noPropertyAccessFromIndexSignature": true   // ✅ Acesso seguro a propriedades
  }
}
```

## 🔥 Tipos Avançados Implementados

### 1. Template Literal Types

```typescript
// Rotas tipadas
type ApiEndpoint = '/api/auth/login' | '/api/auth/refresh';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute<T extends ApiEndpoint> = `${HttpMethod} ${T}`;

// Uso:
const route: ApiRoute<'/api/auth/login'> = 'POST /api/auth/login'; // ✅
const invalid: ApiRoute<'/api/auth/login'> = 'GET /api/auth/login'; // ❌ Erro
```

### 2. Discriminated Unions

```typescript
// Respostas da API com type narrowing
type ApiResponse<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ApiError };

// Uso com type narrowing:
function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    console.log(response.data); // TypeScript sabe que data existe
  } else {
    console.error(response.error); // TypeScript sabe que error existe
  }
}
```

### 3. Variadic Tuple Types

```typescript
// Paginação tipada
type PaginatedResponse<T extends readonly unknown[]> = {
  data: T;
  page: number;
  total: number;
};

// Uso:
const users: PaginatedResponse<[User, User, User]> = {
  data: [user1, user2, user3],
  page: 1,
  total: 100
};
```

### 4. Conditional Types

```typescript
// Campos obrigatórios condicionais
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

interface User {
  id?: number;
  name?: string;
  email?: string;
}

// Torna id e email obrigatórios
type UserWithRequired = RequiredFields<User, 'id' | 'email'>;
```

### 5. Mapped Types com Template Literals

```typescript
// Erros de formulário tipados
type FormErrors<T> = {
  [K in keyof T as `${string & K}Error`]?: string;
};

type LoginForm = { username: string; password: string };
type LoginFormErrors = FormErrors<LoginForm>;
// Resultado: { usernameError?: string; passwordError?: string }
```

### 6. Utility Types Avançados

```typescript
// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

## 🔧 Geração Automática de Tipos (OpenAPI)

### Instalação

```bash
npm install --save-dev openapi-typescript
```

### Comando de Geração

```bash
npm run generate:api-types
```

Gera tipos TypeScript a partir do Swagger do backend:
```
http://localhost:8081/v3/api-docs → src/app/core/types/api.generated.ts
```

### Uso dos Tipos Gerados

```typescript
import { paths, components } from '../types/api.generated';

// Tipos de request/response automáticos
type LoginRequest = components['schemas']['LoginRequest'];
type LoginResponse = components['schemas']['LoginResponse'];

// Tipos de endpoints
type LoginEndpoint = paths['/api/auth/login']['post'];
```

## 📊 Exemplos Práticos

### Discriminated Union para Usuários

```typescript
type UserRole = 'admin' | 'fiscal' | 'usuario' | 'gestor';

type UserByRole = 
  | { role: 'admin'; permissions: 'all'; canManageUsers: true }
  | { role: 'fiscal'; permissions: string[]; canInspect: true }
  | { role: 'usuario'; permissions: string[]; canView: true }
  | { role: 'gestor'; permissions: string[]; canApprove: true };

function getUserPermissions(user: UserByRole) {
  switch (user.role) {
    case 'admin':
      return user.permissions; // TypeScript sabe que é 'all'
    case 'fiscal':
      return user.canInspect; // TypeScript sabe que existe
    case 'usuario':
      return user.canView; // TypeScript sabe que existe
    case 'gestor':
      return user.canApprove; // TypeScript sabe que existe
  }
}
```

### Template Literals para Eventos

```typescript
type EntityType = 'estabelecimento' | 'licenca' | 'processo';
type ActionType = 'created' | 'updated' | 'deleted';
type SystemEvent = `${EntityType}:${ActionType}`;

// Autocomplete para todos os eventos possíveis:
const event: SystemEvent = 'estabelecimento:created'; // ✅
const invalid: SystemEvent = 'estabelecimento:invalid'; // ❌ Erro
```

### Variadic Tuples para Funções Genéricas

```typescript
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

type Result = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]

function concat<T extends unknown[], U extends unknown[]>(
  arr1: T,
  arr2: U
): Concat<T, U> {
  return [...arr1, ...arr2] as Concat<T, U>;
}
```

## 🎓 Boas Práticas

### 1. Use Discriminated Unions para Estados

```typescript
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// NgRx State
interface EstabelecimentoState {
  list: LoadingState<Estabelecimento[]>;
  selected: LoadingState<Estabelecimento>;
}
```

### 2. Template Literals para Type Safety

```typescript
// Rotas tipadas
type Route = `/estabelecimentos/${number}` | '/estabelecimentos';

// CSS Classes tipadas
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonClass = `btn-${ButtonVariant}`;
```

### 3. Conditional Types para Validação

```typescript
type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type ValidatedUser = NonNullableFields<User>;
```

### 4. Mapped Types para Transformações

```typescript
// Converter todos os campos para observables
type Observables<T> = {
  [K in keyof T]: Observable<T[K]>;
};

type UserObservables = Observables<User>;
// { id: Observable<number>; name: Observable<string>; ... }
```

## 🚀 Workflow de Desenvolvimento

### 1. Backend atualiza Swagger

```bash
# Backend Spring Boot expõe:
http://localhost:8081/v3/api-docs
```

### 2. Frontend gera tipos

```bash
npm run generate:api-types
```

### 3. Tipos disponíveis automaticamente

```typescript
import { components } from '../types/api.generated';

type Estabelecimento = components['schemas']['EstabelecimentoDTO'];
type Licenca = components['schemas']['LicenciaDTO'];
```

### 4. Type Safety em toda aplicação

```typescript
// Services
getEstabelecimento(id: number): Observable<Estabelecimento> {
  return this.http.get<Estabelecimento>(`/estabelecimentos/${id}`);
}

// Components
estabelecimento$: Observable<Estabelecimento>;

// Templates com async pipe
<div>{{ (estabelecimento$ | async)?.nome }}</div>
```

## 📈 Benefícios

✅ **Type Safety**: Erros detectados em tempo de compilação
✅ **Autocomplete**: IntelliSense completo no IDE
✅ **Refactoring**: Mudanças propagadas automaticamente
✅ **Documentação**: Tipos servem como documentação viva
✅ **Manutenibilidade**: Código mais fácil de entender e manter
✅ **Performance**: Zero overhead em runtime

## 🔍 Verificação de Tipos

```bash
# Verificar tipos sem compilar
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [openapi-typescript](https://github.com/drwpow/openapi-typescript)

---

**Última atualização:** 2024
**TypeScript:** 5.9.2
**Angular:** 21.0.0
