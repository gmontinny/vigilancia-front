import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { StorageService, StorageType } from '../../core/services/storage.service';
import { STORAGE_KEYS } from '../../core/constants/storage.constants';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: {
                userId: response.userId,
                email: response.email,
                authorities: response.authorities
              },
              token: response.token
            })
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message || 'Erro ao fazer login' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(async ({ user, token }) => {
          await this.storageService.set(STORAGE_KEYS.AUTH_TOKEN, token, {
            type: StorageType.LOCAL
          });
          await this.storageService.set(STORAGE_KEYS.USER_DATA, user, {
            type: StorageType.INDEXED_DB
          });
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        of(null).pipe(
          tap(async () => {
            await this.storageService.remove(STORAGE_KEYS.AUTH_TOKEN, StorageType.LOCAL);
            await this.storageService.remove(STORAGE_KEYS.USER_DATA, StorageType.INDEXED_DB);
          }),
          map(() => AuthActions.logoutSuccess())
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      switchMap(async () => {
        const token = await this.storageService.get<string>(
          STORAGE_KEYS.AUTH_TOKEN,
          StorageType.LOCAL
        );
        const user = await this.storageService.get<any>(
          STORAGE_KEYS.USER_DATA,
          StorageType.INDEXED_DB
        );

        if (token && user) {
          return AuthActions.loadUserFromStorageSuccess({ user, token });
        }
        return AuthActions.loadUserFromStorageFailure();
      })
    )
  );
}
