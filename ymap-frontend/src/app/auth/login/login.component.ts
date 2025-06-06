import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // ✅ ОБЯЗАТЕЛЬНО

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();

  username = '';
  password = '';

  constructor(private authService: AuthService) { }

  submit() {
    if (!this.username || !this.password) {
      alert('Введите имя и пароль');
      return;
    }

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.close.emit(),
      error: () => alert('Ошибка входа. Проверьте данные.'),
    });
  }

  closeModal() {
    this.close.emit();
  }
}
