import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-topbar.html', // Corrected
  styleUrls: ['./admin-topbar.css']
})
export class AdminTopbarComponent {
  @Input() pageTitle: string = 'Tableau de bord';
  @Input() userName: string = 'Admin';
  @Input() userRole: string = 'Administrateur';
  @Input() userImageUrl: string = 'https://randomuser.me/api/portraits/men/32.jpg'; // Default image

  @Output() mobileToggleClicked = new EventEmitter<void>();

  userMenuOpen = false;
  notificationsOpen = false;
  notifications: string[] = ['New user registered', 'Server maintenance soon']; // Sample notifications
  hasNotifications = this.notifications.length > 0;

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) this.notificationsOpen = false; // Close other dropdown
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) this.userMenuOpen = false; // Close other dropdown
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Close user menu if click is outside
    if (this.userMenuOpen && !target.closest('.relative img') && !target.closest('.relative div[class*="absolute"]')) {
      this.userMenuOpen = false;
    }
    // Close notifications if click is outside
    if (this.notificationsOpen && !target.closest('.relative button .fa-bell') && !target.closest('.relative div[class*="absolute"]')) {
      this.notificationsOpen = false;
    }
  }
}
