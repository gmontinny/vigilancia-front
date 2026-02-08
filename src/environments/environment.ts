export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081',
  apiTimeout: 30000,
  recaptcha: {
    siteKey: '6LdiUkYsAAAAABSF2ik_27qRu-dfbK36KTLXGY0E'
  },
  endpoints: {
    auth: {
      login: '/api/auth/login',
      forgotPassword: '/auth/password/forgot',
      newPassword: '/api/auth/new-password',
      refresh: '/api/auth/refresh',
      preCadastro: '/auth/pre-cadastro'
    },
    usuarios: '/usuarios'
  }
};