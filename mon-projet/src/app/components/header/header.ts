import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterLink } from '@angular/router'; // Import RouterLink

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add CommonModule and RouterLink here
  templateUrl: './header.html', // Corrected template URL
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
