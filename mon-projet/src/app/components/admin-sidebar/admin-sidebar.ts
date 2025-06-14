import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  sectionId?: string; // To identify which section to show in admin dashboard
  exact?: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html', // Corrected
  styleUrls: ['./admin-sidebar.css']
})
export class AdminSidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapseClicked = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<NavItem>(); // Emits when a nav link is clicked

  navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/admin/dashboard', sectionId: 'dashboard', exact: true },
    { label: 'Clients', icon: 'fas fa-users', route: '/admin/clients', sectionId: 'clients' },
    { label: 'Agents', icon: 'fas fa-user-tie', route: '/admin/agents', sectionId: 'agents' },
    { label: 'Voyages', icon: 'fas fa-plane-departure', route: '/admin/voyages', sectionId: 'voyages' },
    { label: 'Types de billet', icon: 'fas fa-ticket-alt', route: '/admin/billets', sectionId: 'billets' },
    { label: 'Réservations', icon: 'fas fa-calendar-check', route: '/admin/reservations', sectionId: 'reservations' },
    { label: 'Paiements', icon: 'fas fa-credit-card', route: '/admin/paiements', sectionId: 'paiements' }
  ];

  toggleCollapse() {
    this.toggleCollapseClicked.emit();
  }

  onNavLinkClick(item: NavItem) {
    this.navigate.emit(item);
    // Potentially close mobile sidebar if open, handled by parent
  }
}
