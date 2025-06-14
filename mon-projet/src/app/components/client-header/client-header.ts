import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor
import { RouterLink } from '@angular/router'; // If any links become routerLinks

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-header.html', // Corrected
  styleUrls: ['./client-header.css']
})
export class ClientHeaderComponent {
  @Input() userName: string = 'Client'; // Default name
  @Output() profileClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() mobileTabSelected = new EventEmitter<string>(); // Emits tabId

  isMobileMenuOpen = false;

  mobileNavItems = [
    { label: 'Profil', tabId: 'profile' },
    { label: 'Réservations', tabId: 'bookings' },
    { label: 'Factures', tabId: 'invoices' },
    { label: 'Paiements', tabId: 'payments' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  onMobileLinkClick(tabId: string) {
    this.mobileTabSelected.emit(tabId);
    this.closeMobileMenu();
  }
}
