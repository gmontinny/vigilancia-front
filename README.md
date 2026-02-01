# Sistema Vigilância - Frontend

Sistema de vigilância desenvolvido em Angular seguindo boas práticas de arquitetura.

## 🚀 Início Rápido

### Desenvolvimento Local
```bash
npm install
npm start
```

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
- Usuário: `admin`
- Senha: `123456`

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
│   │   ├── auth.service.ts      # Autenticação e pré-cadastro
│   │   ├── usuario.service.ts
│   │   ├── recaptcha.service.ts  # Serviço reCAPTCHA v3
│   │   ├── storage.service.ts    # Persistência localStorage/IndexedDB
│   │   ├── preferences.service.ts # Preferências do usuário
│   │   └── form-draft.service.ts  # Rascunhos de formulários
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interfaces/         # Tipagem TypeScript
│   │   └── auth.interface.ts
│   └── constants/          # Constantes da aplicação
│       ├── auth.constants.ts
│       └── storage.constants.ts  # Chaves e TTL de storage
├── features/               # Módulos por funcionalidade
│   └── auth/
│       ├── login/          # Tela de login
│       ├── reset-password/ # Solicitação de reset
│       ├── new-password/   # Definição de nova senha
│       └── register/       # Cadastro de usuário
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
- Tela de login com logo personalizado (150x142px)
- Formulário de reset de senha com validação de email
- Formulário de nova senha com confirmação
- **Cadastro de usuário** com validações brasileiras
- Validador customizado para senhas coincidentes
- Validação de senhas (mínimo 6 caracteres)
- Toggle de visualização de senha em todos os campos
- Navegação SPA entre login, reset, nova senha e cadastro

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
- Arquitetura modular (Core/Features/Shared)
- Componentes standalone
- Formulários reativos com validação
- Validadores customizados reutilizáveis
- Diretivas customizadas (máscaras de input)
- Interfaces TypeScript para tipagem forte
- Constantes centralizadas (eliminação de magic numbers)
- Configurações de ambiente (dev/prod)
- Guards de rota
- Separação de responsabilidades
- **Persistência seletiva**: localStorage para tokens, IndexedDB para dados complexos
- **Gestão de estado**: TTL automático, preferências e rascunhos de formulários

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
- `/api/auth/login` - Autenticação
- `/api/auth/reset-password` - Reset de senha
- `/api/auth/new-password` - Nova senha
- `/api/auth/refresh` - Refresh token
- `/auth/pre-cadastro` - Pré-cadastro de usuário (multipart/form-data)

**Variáveis de Ambiente (.env):**
```bash
# reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=6LdiUkYsAAAAABSF2ik_27qRu-dfbK36KTLXGY0E
RECAPTCHA_SECRET_KEY=6LdiUkYsAAAAAO_Ldv7R-n0M99FCB8PEz7jHCr0p
```

**Funcionalidades do reCAPTCHA:**
- Carregamento dinâmico apenas no formulário de cadastro
- Remoção completa ao sair do cadastro (script, badge, iframes, estilos)
- Não interfere em outros formulários (login, reset de senha)

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

## 🐳 Docker

**Dockerfile multi-stage:**
- Build otimizado com Node.js 18 Alpine
- Nginx para servir arquivos estáticos
- Suporte a diferentes ambientes via `BUILD_ENV`

**Configurações:**
- SPA routing com try_files
- Cache para assets estáticos
- Headers de segurança
- Compressão gzip

**Comandos:**
```bash
# Build manual
docker build --build-arg BUILD_ENV=development -t vigilancia-front .

# Executar container
docker run -p 4200:80 vigilancia-front
```

## 📝 Boas Práticas Implementadas

- **Tipagem Forte**: Interfaces TypeScript para todas as estruturas
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
- **State Management**: Preferências e rascunhos persistidos entre sessões
- **SOLID Principles**: Single Responsibility, Dependency Injection

## 📋 Próximos Passos

1. Integrar com API do back-end
2. Criar dashboard principal
3. Implementar interceptors HTTP
4. Adicionar tratamento de erros global
5. Testes unitários

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
# Desenvolvimento
docker-compose up vigilancia-front-dev

# Produção
docker-compose up vigilancia-front-prod

# Build customizado
docker build --build-arg BUILD_ENV=production -t vigilancia-front .
```
