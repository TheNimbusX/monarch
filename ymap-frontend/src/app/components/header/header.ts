import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [CommonModule],
})
export class HeaderComponent {
  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  theme: 'light' | 'dark' = 'light';

  constructor(
    private themeService: ThemeService,
    public authService: AuthService
  ) {
    this.theme = this.themeService.getTheme();
  }

  toggleTheme() {
    this.theme = this.themeService.toggleTheme();
  }

  openAuth(mode: 'login' | 'register') {
    if (mode === 'login') this.loginClick.emit();
    else this.registerClick.emit();
  }

  logout() {
    this.authService.logout();
  }
}
