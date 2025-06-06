import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.scss'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  @Output() close = new EventEmitter<void>();

  username = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService) { }

  register() {
    this.auth.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.error = null;
        this.close.emit();
      },
      error: () => this.error = 'Ошибка регистрации'
    });
  }

  onCancel() {
    this.close.emit();
  }
}
