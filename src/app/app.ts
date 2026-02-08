import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('vigilancia-front');

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    // Carrega usuário do storage ao iniciar aplicação
    this.store.dispatch(AuthActions.loadUserFromStorage());
  }
}
