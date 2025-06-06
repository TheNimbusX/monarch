import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.scss'],
  imports: [CommonModule, FormsModule],
})
export class AuthModalComponent {
  @Input() mode: 'login' | 'register' = 'login';
  @Output() close = new EventEmitter<void>();

  username = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);

  submit() {
    this.errorMessage = '';

    const credentials = {
      username: this.username.trim(),
      password: this.password.trim(),
    };

    if (!credentials.username || !credentials.password) {
      this.errorMessage = 'Введите логин и пароль';
      return;
    }

    if (this.mode === 'login') {
      this.authService.login(credentials).subscribe({
        next: () => this.closeModal(),
        error: () => (this.errorMessage = 'Ошибка входа. Проверьте данные.'),
      });
    }

    if (this.mode === 'register') {
      this.authService.register(credentials).subscribe({
        next: () => this.closeModal(),
        error: () => (this.errorMessage = 'Ошибка регистрации. Попробуйте позже.'),
      });
    }
  }

  closeModal() {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.close.emit();
  }
}
