export const environment = {
  production: true,
  apiBaseUrl: 'https://api.vigilancia.com.br',
  apiTimeout: 30000,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      resetPassword: '/api/auth/reset-password',
      newPassword: '/api/auth/new-password',
      refresh: '/api/auth/refresh'
    }
  }
};