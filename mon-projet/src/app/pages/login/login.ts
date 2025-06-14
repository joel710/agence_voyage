import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Import Router
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

  constructor(private router: Router) { } // Inject Router

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit() {
    console.log('Login form submitted:', this.loginForm);
    if (this.loginForm.email === 'admin@example.com' && this.loginForm.password === 'adminpassword') {
      console.log('Admin credentials match. Attempting to navigate to /admin...');
      this.router.navigate(['/admin']) // Corrected path
        .then(success => {
          if (success) {
            console.log('Navigation to /admin successful!');
          } else {
            console.error('Navigation to /admin failed (returned false).');
          }
        })
        .catch(err => {
          console.error('Error during navigation to /admin:', err);
        });
    } else {
      console.log('Invalid credentials or regular user');
      alert('Identifiants incorrects !');
    }
  }

  socialLogin(provider: string) {
    console.log('Social login with:', provider);
  }
}
