import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state): AuthState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user, token }): AuthState => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }): AuthState => ({
    ...state,
    loading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, (state): AuthState => ({
    ...state,
    loading: true
  })),

  on(AuthActions.logoutSuccess, (): AuthState => ({
    ...initialAuthState
  })),

  // Load from Storage
  on(AuthActions.loadUserFromStorage, (state): AuthState => ({
    ...state,
    loading: true
  })),

  on(AuthActions.loadUserFromStorageSuccess, (state, { user, token }): AuthState => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false
  })),

  on(AuthActions.loadUserFromStorageFailure, (state): AuthState => ({
    ...state,
    loading: false
  })),

  // Clear Error
  on(AuthActions.clearError, (state): AuthState => ({
    ...state,
    error: null
  }))
);
