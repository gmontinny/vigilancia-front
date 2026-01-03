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
- **Cadastro de usuário** com upload de imagem
- Navegação SPA entre telas

## 🏢 Arquitetura

```
src/app/
├── core/                   # Serviços e guards singleton
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── usuario.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interfaces/         # Tipagem TypeScript
│   │   └── auth.interface.ts
│   └── constants/          # Constantes da aplicação
│       └── auth.constants.ts
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
- **Campos obrigatórios**: Nome, CPF, Email, Celular, Sexo, Senha
- **Validações brasileiras**: CPF e celular com algoritmos específicos
- **Upload de imagem**: Foto de perfil opcional para bucket MinIO
- **Radio buttons**: Sexo (Masculino, Feminino, Outros)
- **Status fixos**: Inativo (0) e Em avaliação (0)
- **Integração multipart**: JSON + arquivo de imagem
- **Modelos tipados**: Interfaces com enums para tipo-segurança

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
- Interfaces TypeScript para tipagem forte
- Constantes centralizadas (eliminação de magic numbers)
- Configurações de ambiente (dev/prod)
- Guards de rota
- Separação de responsabilidades

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
- `/usuarios` - Cadastro de usuário (multipart)

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
- **Separação**: Métodos privados e responsabilidades bem definidas
- **Configuração**: Environments para diferentes ambientes
- **Nomenclatura**: Nomes descritivos e padronizados

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
