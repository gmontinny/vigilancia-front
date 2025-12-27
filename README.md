# Sistema Vigilância - Frontend

Sistema de vigilância desenvolvido em Angular seguindo boas práticas de arquitetura.

## 🚀 Início Rápido

```bash
npm install
npm start
```

Acesse: `http://localhost:4200`

## 🔐 Login

**Credenciais de teste:**
- Usuário: `admin`
- Senha: `123456`

## 🏢 Arquitetura

```
src/app/
├── core/                   # Serviços e guards singleton
│   ├── services/
│   │   └── auth.service.ts
│   └── guards/
│       └── auth.guard.ts
├── features/               # Módulos por funcionalidade
│   └── auth/login/
├── shared/                 # Componentes reutilizáveis
│   └── components/
└── app.routes.ts           # Configuração de rotas
```

## 🛠️ Funcionalidades

- ✅ Arquitetura modular (Core/Features/Shared)
- ✅ Serviço de autenticação
- ✅ Guards de rota
- ✅ Lazy loading
- ✅ Formulários reativos
- ✅ Design responsivo

## 📋 Próximos Passos

1. Integrar com API do back-end
2. Criar dashboard principal
3. Implementar interceptors HTTP
4. Adicionar tratamento de erros global

## 🔧 Comandos

```bash
ng serve              # Desenvolvimento
ng build              # Produção
ng test               # Testes
ng generate component # Gerar componente
```
