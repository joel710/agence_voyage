import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'; // Added ElementRef, ViewChild
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Added NgForm
import { ClientHeaderComponent } from '../../components/client-header/client-header.component'; // Corrected path
import { RouterLink } from '@angular/router';

// Interfaces (assuming they are defined as in the previous step for this component)
export interface Booking {
  idReservation: string; dateReservation: string; departVoyage: string; arriveeVoyage: string;
  dateVoyage: string; typeBillet: 'economy' | 'business' | 'first';
  status: 'confirmed' | 'pending' | 'canceled'; price: number;
  statusText?: string; statusClass?: string; typeBilletText?: string;
}
export interface InvoiceItem { description: string; quantity: number; unitPrice: number; total: number; }
export interface Invoice {
  invoiceId: string; date: string; reservationId: string; clientName: string; items: InvoiceItem[];
  subTotal: number; vat: number; totalAmount: number; status: 'Payée' | 'En attente' | 'Remboursée';
  statusClass?: string;
}
export interface Payment {
  codePaiement: string; datePaiement: string; idReservation: string; amount: number;
  status: 'Payée' | 'En attente' | 'Remboursé'; statusClass?: string;
}

@Component({
  selector: 'app-client-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientHeaderComponent, RouterLink],
  templateUrl: './client-dashboard.html', // Corrected
  styleUrls: ['./client-dashboard.css']  // Corrected
})
export class ClientDashboardPageComponent implements OnInit {
  @ViewChild('invoiceTemplateForPrint') invoiceTemplateForPrint!: ElementRef<HTMLDivElement>; // Added ! for definite assignment

  clientUserName: string = 'Sophie Client';
  currentTab: string = 'profile';

  profile = {
    nom: 'Martin', prenom: 'Sophie', dateNaissance: '1985-05-20',
    email: 'sophie.martin@email.com', telephone: '0612345678',
    sexe: 'femme', login: 'sophiem'
  };
  passwordChange = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
  searchCriteria = { departureCity: '', arrivalCity: '', travelDate: '', ticketType: '' };

  bookings: Booking[] = [];
  invoices: Invoice[] = [];
  payments: Payment[] = [];

  constructor() { }

  ngOnInit(): void { this.loadSampleData(); }

  switchTab(tabId: string): void { this.currentTab = tabId; }
  onLogout(): void { console.log('Logout clicked'); /* Navigate to login or home */ }
  onUserProfileClicked(): void { this.switchTab('profile'); }

  saveProfileChanges(form: NgForm): void {
    if (form.invalid) { this.markFormGroupTouched(form); alert('Formulaire de profil invalide.'); return; }
    console.log('Saving profile:', this.profile);
    alert('Profil sauvegardé (simulation)');
  }

  changePassword(form: NgForm): void {
    if (form.invalid) { this.markFormGroupTouched(form); alert('Formulaire de changement de mot de passe invalide.'); return; }
    if (this.passwordChange.newPassword !== this.passwordChange.confirmNewPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.'); return;
    }
    console.log('Changing password for new password length:', this.passwordChange.newPassword.length); // Keep console log for newPassword only
    alert('Mot de passe changé (simulation)');
    form.resetForm();
  }

  searchFlights(form: NgForm): void {
    if (form.invalid) { this.markFormGroupTouched(form); alert('Formulaire de recherche invalide.'); return; }
    console.log('Searching flights with criteria:', this.searchCriteria);
    alert('Recherche de vols simulée. Vérifiez la console pour les critères.');
  }

  viewBookingDetails(booking: Booking): void { alert(\`Détails réservation: \${booking.idReservation}\`); }

  cancelBooking(bookingId: string): void {
    this.bookings = this.bookings.filter(b => b.idReservation !== bookingId);
    alert(\`Réservation \${bookingId} annulée (simulation)\`);
  }

  printInvoice(invoice: Invoice): void {
    if (!this.invoiceTemplateForPrint) {
      alert('Erreur: Modèle de facture non trouvé.'); return;
    }
    const templateEl = this.invoiceTemplateForPrint.nativeElement;

    let itemsHtml = '';
    invoice.items.forEach(item => {
      itemsHtml += \`<tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: left;">\${item.description}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">\${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">\${item.unitPrice.toFixed(2)} €</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">\${item.total.toFixed(2)} €</td>
      </tr>\`;
    });

    templateEl.innerHTML = \`
      <div style="max-width: 800px; margin: auto; background-color: white; padding: 30px; font-family: Arial, sans-serif; line-height: 1.6;">
        <table style="width: 100%; margin-bottom: 30px;">
          <tr>
            <td style="width: 50%;">
              <h1 style="font-size: 24px; font-weight: bold; color: #333; margin:0;">Facture</h1>
              <p style="color: #555; margin-top: 4px;">#\${invoice.invoiceId}</p>
            </td>
            <td style="width: 50%; text-align: right;">
              <p style="color: #555; margin:0;">TravelEase</p>
              <p style="color: #555; margin:0;">123 Rue du Voyage</p>
              <p style="color: #555; margin:0;">75000 Paris</p>
            </td>
          </tr>
        </table>
        <table style="width: 100%; margin-bottom: 30px;">
          <tr>
            <td style="width: 50%;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom:8px;">Facturé à</h3>
              <p style="color: #555; margin:0;">\${invoice.clientName}</p>
            </td>
            <td style="width: 50%; text-align: right;">
              <p style="color: #555; margin:0;">Date: <span style="font-weight:bold;">\${invoice.date}</span></p>
              <p style="color: #555; margin:0;">Réservation: <span style="font-weight:bold;">\${invoice.reservationId}</span></p>
            </td>
          </tr>
        </table>
        <div style="margin-bottom: 30px;">
          <table style="min-width: 100%; border-collapse: collapse;">
            <thead style="background-color: #f8f8f8;"><tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-size: 12px; font-weight: bold; color: #333; text-transform: uppercase;">Description</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: center; font-size: 12px; font-weight: bold; color: #333; text-transform: uppercase;">Quantité</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: right; font-size: 12px; font-weight: bold; color: #333; text-transform: uppercase;">Prix unitaire</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: right; font-size: 12px; font-weight: bold; color: #333; text-transform: uppercase;">Total</th>
            </tr></thead>
            <tbody>\${itemsHtml}</tbody>
          </table>
        </div>
        <table style="width: 100%;"><tr><td style="width:60%;"></td><td style="width:40%;">
          <table style="width: 100%;">
            <tr><td style="padding: 4px 0; color: #555;">Total HT</td><td style="padding: 4px 0; text-align: right; color: #555;">\${invoice.subTotal.toFixed(2)} €</td></tr>
            <tr><td style="padding: 4px 0; color: #555;">TVA (20%)</td><td style="padding: 4px 0; text-align: right; color: #555;">\${invoice.vat.toFixed(2)} €</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #333; border-top: 2px solid #ddd;">Total TTC</td><td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; border-top: 2px solid #ddd;">\${invoice.totalAmount.toFixed(2)} €</td></tr>
          </table>
        </td></tr></table>
      </div>\`;

    const style = document.createElement('style');
    style.textContent = \`
      @media print {
        body * { visibility: hidden !important; }
        .print-section, .print-section * { visibility: visible !important; }
        .print-section { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; }
        @page { size: auto; margin: 20mm; } /* Added some margin for printing */
      }
    \`;
    document.head.appendChild(style);
    templateEl.classList.remove('hidden');

    window.print();

    templateEl.classList.add('hidden');
    document.head.removeChild(style);
    templateEl.innerHTML = '<p>Invoice template content here...</p>';
  }

  generateAllInvoicesPDF(): void {
    alert('Génération PDF de toutes les factures (simulation). Imprimerait la première facture pour exemple.');
    if (this.invoices.length > 0) {
        this.printInvoice(this.invoices[0]);
    }
  }

  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private getStatusInfo(status: Booking['status'] | Invoice['status'] | Payment['status']): { text: string, class: string } {
    switch (status) {
      case 'confirmed': return { text: 'Confirmé', class: 'bg-green-100 text-green-800' };
      case 'pending': return { text: 'En attente', class: 'bg-yellow-100 text-yellow-800' };
      case 'canceled': return { text: 'Annulé', class: 'bg-red-100 text-red-800' };
      case 'Payée': return { text: 'Payée', class: 'bg-green-100 text-green-800' };
      case 'Remboursée': return { text: 'Remboursée', class: 'bg-blue-100 text-blue-800' };
      case 'Remboursé': return { text: 'Remboursé', class: 'bg-blue-100 text-blue-800' };
      default: return { text: status as string, class: 'bg-gray-100 text-gray-800' };
    }
  }
  private getTicketTypeText(type: Booking['typeBillet']): string {
    switch (type) {
      case 'economy': return 'Économique';
      case 'business': return 'Affaires';
      case 'first': return 'Première';
      default: return type;
    }
  }
  loadSampleData(): void {
     this.bookings = [
      { idReservation: 'BOOK001', dateReservation: '2023-09-15', departVoyage: 'Paris (CDG)', arriveeVoyage: 'New York (JFK)', dateVoyage: '2023-10-01', typeBillet: 'business', status: 'confirmed', price: 1200.00 },
      { idReservation: 'BOOK002', dateReservation: '2023-09-10', departVoyage: 'Lyon (LYS)', arriveeVoyage: 'Barcelone (BCN)', dateVoyage: '2023-10-15', typeBillet: 'economy', status: 'pending', price: 800.50 },
    ].map(b => ({ ...b, statusText: this.getStatusInfo(b.status).text, statusClass: this.getStatusInfo(b.status).class, typeBilletText: this.getTicketTypeText(b.typeBillet) }));
    this.invoices = [
      { invoiceId: 'INV001', date: '2023-09-15', reservationId: 'BOOK001', clientName: 'Sophie Martin', items: [{ description: 'Billet Business Paris → New York', quantity: 1, unitPrice: 1000.00, total: 1000.00 }], subTotal: 1000.00, vat: 200.00, totalAmount: 1200.00, status: 'Payée' },
    ].map(i => ({ ...i, statusClass: this.getStatusInfo(i.status).class }));
    this.payments = [
      { codePaiement: 'PAY001', datePaiement: '2023-09-15', idReservation: 'BOOK001', amount: 1200.00, status: 'Payée' },
    ].map(p => ({ ...p, statusClass: this.getStatusInfo(p.status).class }));
  }
}
