import { createAction, props } from '@ngrx/store';
import { LoginRequest, User } from '../../core/interfaces/auth.interface';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Load User from Storage
export const loadUserFromStorage = createAction('[Auth] Load User From Storage');

export const loadUserFromStorageSuccess = createAction(
  '[Auth] Load User From Storage Success',
  props<{ user: User; token: string }>()
);

export const loadUserFromStorageFailure = createAction(
  '[Auth] Load User From Storage Failure'
);

// Clear Error
export const clearError = createAction('[Auth] Clear Error');
