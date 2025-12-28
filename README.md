# Sistema Vigilância - Frontend

Sistema de vigilância desenvolvido em Angular seguindo boas práticas de arquitetura.

## 🚀 Início Rápido

```bash
npm install
npm start
```

Acesse: `http://localhost:4200`

## 🔐 Autenticação

**Credenciais de teste:**
- Usuário: `admin`
- Senha: `123456`

**Funcionalidades:**
- Login com validação de formulário
- Reset de senha com validação completa
- Navegação SPA entre telas

## 🏢 Arquitetura

```
src/app/
├── core/                   # Serviços e guards singleton
│   ├── services/
│   │   └── auth.service.ts
│   └── guards/
│       └── auth.guard.ts
├── features/               # Módulos por funcionalidade
│   └── auth/
│       ├── login/          # Tela de login
│       └── reset-password/ # Redefinição de senha
├── shared/                 # Componentes reutilizáveis
│   ├── constants/          # Constantes do tema
│   ├── validators/         # Validadores customizados
│   └── styles/            # Estilos compartilhados
└── app.routes.ts           # Configuração de rotas
```

## 🛠️ Funcionalidades

### ✅ Autenticação
- Tela de login com logo personalizado (150x142px)
- Formulário de reset de senha completo
- Validação de senhas (mínimo 6 caracteres)
- Toggle de visualização de senha em todos os campos
- Navegação SPA entre login e reset-password

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
- Constantes centralizadas
- Estilos compartilhados
- Guards de rota

## 🎨 Customizações Visuais

- **Logo**: Substituição da palavra "Vigilância" por imagem
- **Cor primária**: #00A859 aplicada em botões e links
- **Background**: Rotação automática entre 2 imagens
- **Validações**: Mensagens padronizadas em português
- **Responsividade**: Layout adaptável para diferentes telas

## 📋 Próximos Passos

1. Integrar com API do back-end
2. Criar dashboard principal
3. Implementar interceptors HTTP
4. Adicionar tratamento de erros global
5. Testes unitários

## 🔧 Comandos

```bash
ng serve              # Desenvolvimento
ng build              # Produção
ng test               # Testes
ng generate component # Gerar componente
```
