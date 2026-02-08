# NgRx - Gerenciamento de Estado

## 📚 O que é NgRx?

NgRx é uma biblioteca de gerenciamento de estado para Angular baseada no padrão Redux. Fornece um store global reativo que centraliza o estado da aplicação, tornando-o previsível e fácil de debugar.

## 🎯 Por que usar NgRx neste projeto?

### Justificativa Técnica

**Sistema de Grande Porte:**
- 150+ Controllers no backend
- 150+ Entidades de domínio
- Múltiplos módulos interconectados (Licenciamento, Fiscalização, Processos, Documentos)

**Complexidade de Estado:**
- Estabelecimentos relacionados com Licenças, Alvarás, Processos
- Fiscais relacionados com Atividades, Autos, Notificações
- Workflows complexos de processos administrativos
- Tramitações com múltiplas instâncias

**Benefícios:**
- ✅ Cache centralizado (evita requisições duplicadas)
- ✅ Estado previsível e debugável
- ✅ Performance com seletores memoizados
- ✅ Persistência entre sessões
- ✅ Time-travel debugging
- ✅ Auditoria de ações (compliance governamental)

## 🏗️ Arquitetura NgRx

### Fluxo de Dados Unidirecional

```
┌─────────────┐
│  Component  │ ──dispatch──> Action
└─────────────┘                 │
       ↑                        ↓
       │                   ┌─────────┐
    subscribe              │ Effects │ ──HTTP──> Backend
       │                   └─────────┘
       │                        │
   ┌────────┐                   ↓
   │ Store  │ <──update── Reducer
   └────────┘
       │
       ↓
   Selectors (memoizados)
```

### Componentes Principais

**1. State (Estado)**
- Define a estrutura do estado
- Imutável
- Tipado com TypeScript

**2. Actions (Ações)**
- Eventos que descrevem mudanças
- Único lugar onde mudanças são iniciadas
- Formato: `[Source] Event`

**3. Reducers (Redutores)**
- Funções puras que atualizam o estado
- Recebem estado atual + ação = novo estado
- Nunca modificam o estado diretamente

**4. Effects (Efeitos)**
- Gerenciam side effects (HTTP, localStorage, etc.)
- Escutam ações e disparam novas ações
- Isolam lógica assíncrona

**5. Selectors (Seletores)**
- Funções para ler dados do store
- Memoizados (cache automático)
- Composíveis e reutilizáveis

## 📁 Estrutura de Arquivos

```
src/app/store/
├── app.state.ts              # Estado global da aplicação
├── index.ts                  # Barrel exports
└── auth/                     # Feature: Autenticação
    ├── auth.state.ts         # Estado do módulo auth
    ├── auth.actions.ts       # Ações (login, logout, etc.)
    ├── auth.reducer.ts       # Reducer para atualizar estado
    ├── auth.effects.ts       # Effects para HTTP e storage
    ├── auth.selectors.ts     # Selectors memoizados
    └── index.ts              # Barrel exports
```

## 🔧 Implementação Atual

### 1. Estado de Autenticação

```typescript
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### 2. Actions Disponíveis

```typescript
// Login
login({ credentials })           // Inicia login
loginSuccess({ user, token })    // Login bem-sucedido
loginFailure({ error })          // Login falhou

// Logout
logout()                         // Inicia logout
logoutSuccess()                  // Logout completo

// Persistência
loadUserFromStorage()            // Carrega do localStorage/IndexedDB
loadUserFromStorageSuccess()     // Carregamento bem-sucedido
loadUserFromStorageFailure()     // Falha ao carregar

// Utilidades
clearError()                     // Limpa mensagens de erro
```

### 3. Selectors Disponíveis

```typescript
selectUser              // Usuário completo
selectToken             // Token JWT
selectIsAuthenticated   // Boolean de autenticação
selectAuthLoading       // Estado de loading
selectAuthError         // Mensagem de erro
selectUserName          // Nome do usuário
selectUserEmail         // Email do usuário
```

## 💻 Como Usar no Componente

### Injetar Store

```typescript
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';

constructor(private readonly store: Store<AppState>) {}
```

### Dispatch de Actions

```typescript
// Login
this.store.dispatch(AuthActions.login({ 
  credentials: { username: 'admin', password: '123456' } 
}));

// Logout
this.store.dispatch(AuthActions.logout());

// Limpar erro
this.store.dispatch(AuthActions.clearError());
```

### Selecionar Dados (Subscribe)

```typescript
// Observable
isLoading$: Observable<boolean>;
errorMessage$: Observable<string | null>;

constructor(private readonly store: Store<AppState>) {
  this.isLoading$ = this.store.select(AuthSelectors.selectAuthLoading);
  this.errorMessage$ = this.store.select(AuthSelectors.selectAuthError);
}
```

### Usar no Template com Async Pipe

```html
<!-- Loading -->
@if(isLoading$ | async) {
  <span class="spinner-border"></span>
}

<!-- Erro -->
@if(errorMessage$ | async; as errorMessage) {
  <p class="text-danger">{{ errorMessage }}</p>
}

<!-- Botão desabilitado -->
<button [disabled]="isLoading$ | async">Entrar</button>
```

## 🔍 DevTools

### Instalação da Extensão

**Chrome:**
https://chrome.google.com/webstore/detail/redux-devtools

**Firefox:**
https://addons.mozilla.org/firefox/addon/reduxdevtools/

### Funcionalidades

- ✅ Visualizar todas as actions disparadas
- ✅ Inspecionar estado antes/depois de cada action
- ✅ Time-travel debugging (voltar no tempo)
- ✅ Exportar/importar estado
- ✅ Testar actions manualmente

### Como Usar

1. Abra DevTools (F12)
2. Aba "Redux"
3. Veja histórico de actions
4. Clique em uma action para ver diff do estado
5. Use slider para voltar no tempo

## 📊 Boas Práticas Implementadas

### 1. Nomenclatura de Actions

```typescript
// Padrão: [Source] Event
'[Auth] Login'
'[Auth] Login Success'
'[Auth] Login Failure'
```

### 2. Reducers Puros

```typescript
// ✅ Correto - Retorna novo objeto
on(AuthActions.loginSuccess, (state, { user, token }): AuthState => ({
  ...state,
  user,
  token,
  isAuthenticated: true
}))

// ❌ Errado - Modifica estado diretamente
on(AuthActions.loginSuccess, (state, { user, token }) => {
  state.user = user; // NUNCA FAÇA ISSO!
  return state;
})
```

### 3. Effects com Error Handling

```typescript
login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.login),
    switchMap(({ credentials }) =>
      this.authService.login(credentials).pipe(
        map(response => AuthActions.loginSuccess(response)),
        catchError(error => of(AuthActions.loginFailure({ error })))
      )
    )
  )
);
```

### 4. Selectors Memoizados

```typescript
// Selector base
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selectors compostos (memoizados automaticamente)
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user?.nome || ''
);
```

### 5. Tipagem Forte

```typescript
// Estado tipado
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Actions tipadas
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);
```

## 🚀 Próximos Passos

### Features a Implementar

1. **Estabelecimentos Store**
   - CRUD de estabelecimentos
   - Cache de listagens
   - Filtros e paginação

2. **Licenciamento Store**
   - Workflow de licenças
   - Status de tramitação
   - Documentos anexados

3. **Fiscalização Store**
   - Atividades fiscais
   - Autos de infração
   - Notificações

4. **Processos Store**
   - Processos administrativos
   - Timeline de eventos
   - Tramitações

### Padrão para Novas Features

```typescript
// 1. Criar pasta: src/app/store/estabelecimento/
// 2. Criar arquivos:
//    - estabelecimento.state.ts
//    - estabelecimento.actions.ts
//    - estabelecimento.reducer.ts
//    - estabelecimento.effects.ts
//    - estabelecimento.selectors.ts
//    - index.ts

// 3. Registrar no app.state.ts
export interface AppState {
  auth: AuthState;
  estabelecimento: EstabelecimentoState; // Novo
}

// 4. Adicionar reducer
export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  estabelecimento: estabelecimentoReducer // Novo
};

// 5. Registrar effects no app.config.ts
provideEffects([AuthEffects, EstabelecimentoEffects])
```

## 📖 Recursos Adicionais

**Documentação Oficial:**
- https://ngrx.io/docs

**Tutoriais:**
- https://ngrx.io/guide/store
- https://ngrx.io/guide/effects
- https://ngrx.io/guide/entity

**Exemplos:**
- https://github.com/ngrx/platform/tree/main/projects/example-app

---

**Última atualização:** 2024
**Versão NgRx:** 19.0.0
**Versão Angular:** 21.0.0
