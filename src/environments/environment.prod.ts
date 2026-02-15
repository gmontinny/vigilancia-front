export const environment = {
  production: true,
  apiBaseUrl: 'https://api.vigilancia.com.br',
  apiTimeout: 30000,
  recaptcha: {
    siteKey: '6LdiUkYsAAAAABSF2ik_27qRu-dfbK36KTLXGY0E'
  },
  endpoints: {
    auth: {
      login: '/auth/login',
      refresh: '/auth/refresh',
      me: '/auth/me',
      forgotPassword: '/auth/password/forgot',
      newPassword: '/api/auth/new-password',
      preCadastro: '/auth/pre-cadastro'
    },
    usuarios: '/usuarios'
  }
};