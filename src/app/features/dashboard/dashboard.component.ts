import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName = '';
  userEmail = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    const userData = await this.authService.getUserData();
    if (userData) {
      this.userEmail = userData.email;
      this.userName = userData.email.split('@')[0];
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
