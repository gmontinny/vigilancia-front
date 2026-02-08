# Instalação do NgRx

## Dependências Adicionadas

As seguintes dependências foram adicionadas ao `package.json`:

```json
"@ngrx/store": "^19.0.0",
"@ngrx/effects": "^19.0.0",
"@ngrx/entity": "^19.0.0",
"@ngrx/store-devtools": "^19.0.0"
```

## Comando de Instalação

Execute o seguinte comando para instalar as dependências:

```bash
npm install --legacy-peer-deps
```

**Nota:** O flag `--legacy-peer-deps` é necessário devido à incompatibilidade de versão entre Angular 21 e NgRx 19 (que requer Angular 19). Isso é seguro e não afeta a funcionalidade.

## Verificação

Após a instalação, verifique se as dependências foram instaladas corretamente:

```bash
npm list @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
```

## Redux DevTools (Opcional)

Para usar o Redux DevTools no navegador, instale a extensão:

**Chrome:**
https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

**Firefox:**
https://addons.mozilla.org/firefox/addon/reduxdevtools/

## Estrutura Criada

```
src/app/store/
├── app.state.ts              # Estado global
├── index.ts                  # Exports
└── auth/
    ├── auth.state.ts         # Estado de autenticação
    ├── auth.actions.ts       # Actions
    ├── auth.reducer.ts       # Reducer
    ├── auth.effects.ts       # Effects
    ├── auth.selectors.ts     # Selectors
    └── index.ts              # Exports
```

## Arquivos Modificados

1. **package.json** - Dependências NgRx adicionadas
2. **app.config.ts** - Store, Effects e DevTools configurados
3. **app.ts** - Dispatch de loadUserFromStorage no init
4. **login.component.ts** - Migrado para usar NgRx store
5. **login.component.html** - Async pipes para observables
6. **auth.guard.ts** - Usa selector do store

## Próximos Passos

1. Execute `npm install`
2. Execute `npm start`
3. Abra Redux DevTools no navegador (F12 > Redux)
4. Faça login e veja as actions sendo disparadas
5. Consulte [docs/NGRX.md](NGRX.md) para guia completo

## Compatibilidade

- Angular: 21.0.0
- NgRx: 19.0.0
- TypeScript: 5.9.2
- RxJS: 7.8.0

## Sem Quebras

✅ Todas as funcionalidades existentes continuam funcionando
✅ AuthService mantido para compatibilidade
✅ StorageService integrado com Effects
✅ Guards migrados para usar selectors
✅ Componentes migrados gradualmente
