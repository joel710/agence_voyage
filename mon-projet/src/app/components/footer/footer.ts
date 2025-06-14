import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // Add FormsModule
  templateUrl: './footer.html', // Corrected from .component.html
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail: string = '';

  onNewsletterSubmit() {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription for:', this.newsletterEmail);
      // Here you would typically call a service to handle the subscription
      this.newsletterEmail = ''; // Reset email field
    }
  }
}
