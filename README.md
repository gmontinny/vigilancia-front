# Sistema Vigilância - Frontend

Sistema de vigilância desenvolvido em Angular seguindo boas práticas de arquitetura.

## 🚀 Início Rápido

### Desenvolvimento Local
```bash
npm install --legacy-peer-deps
npm start
```

**Nota:** O flag `--legacy-peer-deps` é necessário devido à incompatibilidade de versão entre Angular 21 e NgRx 19.

### Docker (Recomendado)
```bash
# Desenvolvimento
docker-compose up vigilancia-front-dev

# Produção
docker-compose up vigilancia-front-prod
```

Acesse: `http://localhost:4200` (dev) ou `http://localhost` (prod)

## 🔐 Autenticação

**Credenciais de teste:**
- Email: `admin@local` ou CPF: `123.456.789-00`
- Senha: `admin` (mínimo 5 caracteres)

**Funcionalidades:**
- Login com validação de formulário
- Reset de senha com validação completa
- **Cadastro de usuário** com upload de imagem e **reCAPTCHA v3**
- Navegação SPA entre telas

## 🏢 Arquitetura

```
src/app/
├── core/                   # Serviços e guards singleton
│   ├── services/
│   │   ├── auth.service.ts      # Autenticação JWT (login, refresh, me)
│   │   ├── usuario.service.ts
│   │   ├── recaptcha.service.ts  # Serviço reCAPTCHA v3
│   │   ├── storage.service.ts    # Persistência localStorage/IndexedDB
│   │   ├── preferences.service.ts # Preferências do usuário
│   │   └── form-draft.service.ts  # Rascunhos de formulários
│   ├── guards/
│   │   └── auth.guard.ts         # Guard assíncrono
│   ├── interceptors/
│   │   └── auth.interceptor.ts   # Token JWT e refresh automático
│   ├── interfaces/         # Tipagem TypeScript
│   │   └── auth.interface.ts
│   ├── types/              # TypeScript Avançado
│   │   └── advanced.types.ts     # Template literals, discriminated unions
│   └── constants/          # Constantes da aplicação
│       ├── auth.constants.ts
│       └── storage.constants.ts  # Chaves e TTL de storage
├── store/                  # NgRx State Management
│   ├── app.state.ts        # Estado global da aplicação
│   ├── index.ts            # Barrel exports
│   └── auth/               # Feature: Autenticação
│       ├── auth.state.ts   # Estado do módulo auth
│       ├── auth.actions.ts # Actions (login, logout, etc.)
│       ├── auth.reducer.ts # Reducer para atualizar estado
│       ├── auth.effects.ts # Effects com inject() moderno
│       ├── auth.selectors.ts # Selectors memoizados
│       └── index.ts        # Barrel exports
├── features/               # Módulos por funcionalidade
│   ├── auth/
│   │   ├── login/          # Tela de login com NgRx
│   │   ├── reset-password/ # Solicitação de reset
│   │   ├── new-password/   # Definição de nova senha
│   │   └── register/       # Cadastro de usuário
│   └── dashboard/          # Dashboard principal do sistema
├── shared/                 # Componentes reutilizáveis
│   ├── models/            # Interfaces e tipos
│   │   └── usuario.model.ts
│   ├── validators/         # Validadores customizados
│   │   └── custom-validators.ts
│   ├── directives/         # Diretivas reutilizáveis
│   │   └── mask.directive.ts  # Máscaras CPF e Celular
│   ├── constants/          # Constantes do tema
│   └── styles/            # Estilos compartilhados
├── environments/           # Configurações de ambiente
│   ├── environment.ts      # Desenvolvimento
│   └── environment.prod.ts # Produção
└── app.routes.ts           # Configuração de rotas
```

## 🛠️ Funcionalidades

### ✅ Autenticação
- **Login JWT**: Email ou CPF com detecção automática
- **Refresh Token**: Renovação automática antes de expirar (5 min)
- **Interceptor HTTP**: Adiciona token automaticamente em todas as requisições
- **Persistência**: Token em localStorage, dados em IndexedDB
- **Expiração**: Controle de TTL com validação automática
- **AuthGuard**: Proteção de rotas com verificação de token persistido
- Tela de login com logo personalizado (150x142px)
- **Formulário de reset de senha**: Solicita link por email com reCAPTCHA v3 (sempre retorna 200)
- **Formulário de nova senha**: Recebe token via query param, valida e redefine senha
- **Cadastro de usuário** com validações brasileiras e reCAPTCHA v3
- Validador customizado para senhas coincidentes
- Validação de senhas (mínimo 5 caracteres)
- Toggle de visualização de senha em todos os campos
- Navegação SPA entre login, reset, nova senha e cadastro
- Validação de token antes do envio (new-password)

### ✅ Dashboard
- **Tela principal**: Dashboard após autenticação
- **Informações do usuário**: Exibe email e nome extraído
- **Cards de estatísticas**: Usuários, Estabelecimentos, Licenças, Fiscalizações
- **Botão de logout**: Encerra sessão e redireciona para login
- **Persistência de sessão**: Mantém autenticação após F5

### ✅ Cadastro de Usuário
- **Campos obrigatórios**: Nome, CPF, Email, Celular, Sexo, Senha, Confirmar Senha
- **Máscaras automáticas**: CPF (000.000.000-00) e Celular ((00) 90000-0000)
- **Upload de imagem**: Foto de perfil opcional
- **Radio buttons**: Sexo (Masculino, Feminino, Outros)
- **Checkbox**: Aceitação de termos obrigatória
- **Integração multipart**: FormData com JSON (dados) + arquivo (imagem)
- **Endpoint**: POST `/auth/pre-cadastro` com MediaType.MULTIPART_FORM_DATA
- **reCAPTCHA v3**: Proteção contra bots (carregamento/remoção dinâmica)

### ✅ Interface
- Design responsivo baseado no template Xintra
- Tema personalizado com cor primária #00A859
- Background dinâmico (alternância a cada 10 segundos)
- Efeitos visuais (sombras e blur)
- Fonte Poppins integrada
- Checkbox e links com cor do tema

### ✅ Arquitetura
- Arquitetura modular (Core/Features/Shared/Store)
- Componentes standalone
- **NgRx State Management**: Store global com actions, reducers, effects e selectors
- **Redux DevTools**: Debug com time-travel e inspeção de estado
- **Client-Side Rendering**: SSR desabilitado para compatibilidade com IndexedDB/localStorage
- **Injeção Moderna**: Effects usam `inject()` ao invés de constructor
- Formulários reativos com validação
- Validadores customizados reutilizáveis
- Diretivas customizadas (máscaras de input)
- Interfaces TypeScript para tipagem forte
- **TypeScript Avançado**: Template literals, discriminated unions, variadic tuples
- Constantes centralizadas (eliminação de magic numbers)
- Configurações de ambiente (dev/prod)
- Guards de rota com NgRx selectors
- Separação de responsabilidades
- **Persistência seletiva**: localStorage para tokens, IndexedDB para dados complexos
- **Gestão de estado centralizada**: NgRx para estado global reativo

## 🎨 Customizações Visuais

- **Logo**: Substituição da palavra "Vigilância" por imagem
- **Cor primária**: #00A859 aplicada em botões e links
- **Background**: Rotação automática entre 2 imagens
- **Validações**: Mensagens padronizadas em português
- **Responsividade**: Layout adaptável para diferentes telas

## 🔧 Configuração Backend

**Ambiente de Desenvolvimento:**
- Backend: Spring Boot na porta 8081
- URL: `http://localhost:8081`

**Ambiente de Produção:**
- URL: `https://api.vigilancia.com.br` (a definir)

**Endpoints configurados:**
- `/auth/login` - Autenticação JWT (POST: `{email, senha}` ou `{cpf, senha}`)
- `/auth/refresh` - Renovar token JWT (POST com Bearer token)
- `/auth/me` - Dados do usuário autenticado (GET com Bearer token)
- `/auth/password/forgot` - Solicitação de reset (POST: `{email}`, sempre retorna 200)
- `/auth/password/reset` - Redefinição de senha (POST: `{token, novaSenha}`)
- `/auth/pre-cadastro` - Pré-cadastro de usuário (multipart/form-data)

**Regras de Autenticação:**
- Backend aceita **email** (`{email, senha}`) ou **CPF** (`{cpf, senha}`)
- Frontend detecta automaticamente se é email (contém @) ou CPF
- CPF aceita com ou sem máscara (123.456.789-00 ou 12345678900)
- Validação de senha com BCrypt
- Retorna JWT com expiração de 1 hora (3600s)

**Fluxo de Reset de Senha:**
1. Usuário informa email em `/reset-password`
2. Frontend executa reCAPTCHA v3 (action: `forgot_password`)
3. Frontend envia POST para `/auth/password/forgot` com `{email}`
4. Backend envia email com link: `http://localhost:4200/new-password?token=TOKEN`
5. Usuário clica no link e é redirecionado para `/new-password`
6. Formulário captura token da URL via `ActivatedRoute.queryParams`
7. Validação: Se token não existe, exibe mensagem de erro
8. Usuário informa nova senha e confirmação
9. Frontend envia POST para `/auth/password/reset` com `{token, novaSenha}`
10. Backend valida token (válido por 2 horas) e atualiza senha
11. Usuário é redirecionado para `/login` com mensagem de sucesso

**Variáveis de Ambiente (.env):**
```bash
# Backend Configuration
API_BASE_URL=http://localhost:8081
API_TIMEOUT=30000

# Environment
NODE_ENV=development

# API Endpoints
API_AUTH_LOGIN=/api/auth/login
API_AUTH_FORGOT_PASSWORD=/auth/password/forgot
API_AUTH_NEW_PASSWORD=/api/auth/new-password
API_AUTH_REFRESH=/api/auth/refresh
API_AUTH_PRE_CADASTRO=/auth/pre-cadastro
API_USUARIOS=/usuarios

# reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=6LdiUkYsAAAAABSF2ik_27qRu-dfbK36KTLXGY0E
RECAPTCHA_SECRET_KEY=6LdiUkYsAAAAAO_Ldv7R-n0M99FCB8PEz7jHCr0p
```

**Funcionalidades do reCAPTCHA:**
- Carregamento dinâmico nos formulários de cadastro e reset de senha
- Remoção completa ao sair dos componentes (script, badge, iframes, estilos)
- Proteção contra bots e ataques automatizados
- Não interfere no formulário de login

## 🏪 NgRx State Management

**Gerenciamento de Estado Centralizado:**
- **Store Global**: Estado reativo e previsível
- **Actions**: Eventos tipados para todas as mudanças
- **Reducers**: Funções puras para atualizar estado
- **Effects**: Side effects isolados (HTTP, storage, navegação)
- **Selectors**: Queries memoizadas para performance
- **Injeção Moderna**: Effects usam `inject()` do Angular

**Features Implementadas:**
- ✅ **Auth Store**: Login, logout, persistência de sessão
- ✅ **DevTools**: Redux DevTools para debug
- ✅ **Async Pipe**: Gerenciamento automático de subscriptions
- ✅ **Type Safety**: Tipagem forte em todo o fluxo
- ✅ **CSR Only**: Client-Side Rendering para compatibilidade com storage APIs

**Documentação Completa:**
- Veja [docs/NGRX.md](docs/NGRX.md) para guia completo de uso

**Por que NgRx neste projeto?**
- Sistema de grande porte (150+ entidades no backend)
- Múltiplos módulos interconectados
- Cache centralizado para evitar requisições duplicadas
- Auditoria de ações para compliance governamental
- Performance com seletores memoizados

## 🎯 TypeScript Avançado

**Tipagem Avançada Implementada:**
- **Template Literal Types**: Rotas e eventos tipados
- **Discriminated Unions**: API responses com type narrowing
- **Variadic Tuple Types**: Paginação tipada
- **Conditional Types**: Campos obrigatórios condicionais
- **Mapped Types**: Form errors automáticos
- **Utility Types**: DeepPartial, DeepReadonly

**Geração Automática de Tipos:**
```bash
npm run generate:api-types
```
Gera tipos TypeScript do Swagger: `http://localhost:8081/v3/api-docs`

**Strictness Configurado:**
- ✅ `strict: true` (noImplicitAny, strictNullChecks)
- ✅ `noImplicitReturns`
- ✅ `noFallthroughCasesInSwitch`
- ✅ `strictInjectionParameters`
- ✅ `strictTemplates`

**Documentação Completa:**
- Veja [docs/TYPESCRIPT.md](docs/TYPESCRIPT.md) para exemplos e guia completo

## 💾 Persistência de Dados

**StorageService - Abstração unificada:**
- **localStorage**: Tokens de autenticação, preferências, rascunhos
- **sessionStorage**: Dados temporários da sessão
- **IndexedDB**: Dados complexos do usuário

**Funcionalidades:**
- TTL automático (expiração de dados)
- Limpeza automática de dados expirados
- Serialização/desserialização automática
- Suporte a tipos genéricos TypeScript

**Serviços especializados:**
- **PreferencesService**: Tema, idioma, notificações
- **FormDraftService**: Salvamento automático de formulários (TTL: 1 dia)
- **AuthService**: Token (TTL: 1 semana), dados do usuário (IndexedDB)

## ⚙️ Configurações Técnicas

**Rendering:**
- **CSR (Client-Side Rendering)**: SSR desabilitado
- **Motivo**: Compatibilidade com IndexedDB, localStorage e reCAPTCHA
- **Benefício**: Desenvolvimento simplificado para sistema administrativo

**Injeção de Dependências:**
- **Padrão Moderno**: `inject()` function-based
- **Usado em**: Effects, Guards, Services
- **Benefício**: Melhor compatibilidade com standalone APIs

**Versões:**
- Angular: 21.0.0
- NgRx: 19.0.0 (com --legacy-peer-deps)
- TypeScript: 5.9.2
- RxJS: 7.8.0

## 🐳 DockerDB)

## 🐳 Docker

**Dockerfile multi-stage:**
- Build otimizado com Node.js 18 Alpine
- Nginx para servir arquivos estáticos
- Suporte a diferentes ambientes via `BUILD_ENV`
- **Injeção de variáveis**: API_BASE_URL e RECAPTCHA_SITE_KEY via build args
- **Geração dinâmica**: environment.ts criado durante build com variáveis

**docker-compose.yml:**
- **env_file**: Carrega variáveis do .env automaticamente
- **Build args**: Passa API_BASE_URL e RECAPTCHA_SITE_KEY para Dockerfile
- **Ambientes separados**: Dev (porta 4200) e Prod (porta 80)
- **Produção**: URL hardcoded para `https://api.vigilancia.com.br`

**Configurações Nginx:**
- SPA routing com try_files
- Cache para assets estáticos
- Headers de segurança
- Compressão gzip

**Comandos:**
```bash
# Build manual com variáveis
docker build \
  --build-arg BUILD_ENV=development \
  --build-arg API_BASE_URL=http://localhost:8081 \
  --build-arg RECAPTCHA_SITE_KEY=6LdiUkYsAAAAABSF2ik_27qRu-dfbK36KTLXGY0E \
  -t vigilancia-front .

# Executar container
docker run -p 4200:80 vigilancia-front
```

## 📝 Boas Práticas Implementadas

- **Tipagem Forte**: Interfaces TypeScript para todas as estruturas
- **TypeScript Avançado**: Template literals, discriminated unions, variadic tuples
- **Geração Automática**: Tipos gerados do Swagger/OpenAPI via openapi-typescript
- **Strictness Total**: noImplicitAny, strictNullChecks, noImplicitReturns habilitados
- **NgRx Store**: Gerenciamento de estado centralizado e reativo
- **Injeção Moderna**: inject() ao invés de constructor
- **CSR Only**: Client-Side Rendering para compatibilidade com storage APIs
- **Immutability**: Estado imutável com reducers puros
- **Memoization**: Selectors memoizados para performance
- **Effects**: Side effects isolados e testáveis
- **Constantes**: Eliminação de magic numbers e strings
- **Validadores**: Classes reutilizáveis para validações customizadas
- **Separação de Responsabilidades**: Métodos privados com responsabilidade única
- **Readonly Properties**: Dependências injetadas como readonly
- **Early Return**: Validações no início dos métodos
- **RxJS Operators**: Uso de finalize, catchError para gerenciamento de estado
- **Service Layer**: Lógica HTTP centralizada em services
- **DRY Principle**: Eliminação de código duplicado
- **Encapsulamento**: Métodos privados para lógica interna
- **Error Handling**: Tratamento de erros centralizado
- **Configuração**: Environments para diferentes ambientes
- **Nomenclatura**: Nomes descritivos e padronizados
- **Segurança**: reCAPTCHA v3 com variáveis de ambiente e limpeza completa
- **Carregamento Assíncrono**: Scripts externos carregados dinamicamente
- **Gestão de Memória**: Remoção completa de recursos não utilizados
- **Persistência Inteligente**: localStorage/IndexedDB com TTL e limpeza automática
- **Storage Service**: Abstração unificada para diferentes tipos de armazenamento
- **State Management**: NgRx com actions, reducers, effects e selectors
- **SOLID Principles**: Single Responsibility, Dependency Injection

## 📋 Próximos Passos

1. Implementar stores NgRx para features principais:
   - Estabelecimentos Store (CRUD + cache)
   - Licenciamento Store (workflow + tramitações)
   - Fiscalização Store (atividades + autos)
   - Processos Store (administrativos + timeline)
2. Criar dashboard principal
3. Implementar interceptors HTTP com token do store
4. Adicionar tratamento de erros global
5. Testes unitários (reducers, effects, selectors)

## 🔧 Comandos

### Desenvolvimento
```bash
ng serve              # Servidor local
ng build              # Build produção
ng test               # Testes unitários
ng generate component # Gerar componente
```

### Docker
```bash
# Desenvolvimento (carrega .env automaticamente)
docker-compose up vigilancia-front-dev

# Produção (usa URL de produção)
docker-compose up vigilancia-front-prod

# Build customizado com variáveis
docker build \
  --build-arg BUILD_ENV=production \
  --build-arg API_BASE_URL=https://api.vigilancia.com.br \
  --build-arg RECAPTCHA_SITE_KEY=YOUR_KEY \
  -t vigilancia-front .

# Rebuild forçado
docker-compose up --build vigilancia-front-dev
```
