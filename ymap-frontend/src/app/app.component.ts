import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { MapComponent } from './components/map/map';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss'],
  imports: [
    HeaderComponent,
    MapComponent,
    LoginComponent,
    RegisterComponent,
    CommonModule
  ]
})
export class AppComponent {
  showLogin = false;
  showRegister = false;

  openLogin() {
    this.showLogin = true;
    this.showRegister = false;
  }

  openRegister() {
    this.showLogin = false;
    this.showRegister = true;
  }

  closeAuth() {
    this.showLogin = false;
    this.showRegister = false;
  }
}
