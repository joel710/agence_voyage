import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './login.html', // Corrected filename
  styleUrls: ['./login.css']  // Corrected filename
})
export class LoginPageComponent {
  loginForm = {
    email: '',
    password: '',
    rememberMe: false
  };
  showPassword = false;
  currentYear = new Date().getFullYear();

  constructor() { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit() {
    console.log('Login form submitted:', this.loginForm);
  }

  socialLogin(provider: string) {
    console.log('Social login with:', provider);
  }
}
