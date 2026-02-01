export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_PREFERENCES: 'user_preferences',
  FORM_DRAFT: 'form_draft',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const;

export const STORAGE_TTL = {
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000
} as const;
