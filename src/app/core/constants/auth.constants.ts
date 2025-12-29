export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  BACKGROUND_ROTATION_INTERVAL: 10000,
  SUCCESS_REDIRECT_DELAY: 2000,
  SIMULATION_DELAY: 2000
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_USERNAME: 'Usuário é obrigatório',
  REQUIRED_PASSWORD: 'Senha é obrigatória',
  REQUIRED_EMAIL: 'Email é obrigatório',
  REQUIRED_NEW_PASSWORD: 'Nova senha é obrigatória',
  REQUIRED_CONFIRM_PASSWORD: 'Confirmação de senha é obrigatória',
  MIN_PASSWORD_LENGTH: 'Senha deve ter pelo menos 6 caracteres',
  INVALID_EMAIL: 'Digite um email válido',
  PASSWORD_MISMATCH: 'As senhas não coincidem',
  INVALID_CREDENTIALS: 'Usuário ou senha inválidos'
} as const;

export const ROUTES = {
  LOGIN: '/login',
  RESET_PASSWORD: '/reset-password',
  NEW_PASSWORD: '/new-password',
  DASHBOARD: '/dashboard'
} as const;