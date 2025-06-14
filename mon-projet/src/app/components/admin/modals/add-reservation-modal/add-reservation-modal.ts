import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

// Assuming these interfaces are defined elsewhere or will be simple for now
export interface BasicClientInfo { id: string; name: string; }
export interface BasicVoyageInfo { id: string; label: string; } // e.g., "Paris -> New York (10/12/2023)"
export interface BasicTypeBilletInfo { id: string; libelle: string; }

export interface ReservationData {
  id?: string;
  dateReservation: string;
  clientId: string;
  voyageId: string;
  typeBilletId: string;
  nombrePlaces: number;
  statut: 'En attente' | 'Confirmée' | 'Annulée' | '';
}

@Component({
  selector: 'app-add-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-reservation-modal.html', // Corrected
  styleUrls: ['./add-reservation-modal.css']  // Corrected
})
export class AddReservationModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() reservationToEdit: ReservationData | null = null;
  @Input() availableClients: BasicClientInfo[] = [];
  @Input() availableVoyages: BasicVoyageInfo[] = [];
  @Input() availableBillets: BasicTypeBilletInfo[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveReservation = new EventEmitter<ReservationData>();

  modalTitle: string = 'Ajouter une Réservation';
  reservationData: ReservationData = this.getInitialReservationData();

  constructor() {}

  ngOnInit(): void {
    this.initializeReservationData();
  }

  ngOnChanges(changes: SimpleChanges): void { // Added SimpleChanges type
    if (changes['reservationToEdit']) { // Check specific input property
      this.initializeReservationData();
    }
    // Could also react to changes in availableClients, availableVoyages, availableBillets if needed
  }

  private initializeReservationData(): void {
    if (this.reservationToEdit) {
      this.modalTitle = 'Modifier la Réservation';
      this.reservationData = {
        ...this.reservationToEdit,
        dateReservation: this.formatDateForInput(this.reservationToEdit.dateReservation)
      };
    } else {
      this.modalTitle = 'Ajouter une Réservation';
      this.reservationData = this.getInitialReservationData();
    }
  }

  getInitialReservationData(): ReservationData {
    return {
      dateReservation: this.formatDateForInput(new Date().toISOString()),
      clientId: '',
      voyageId: '',
      typeBilletId: '',
      nombrePlaces: 1,
      statut: 'En attente'
    };
  }

  private formatDateForInput(dateStr?: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0]; // Default to today if no date string
    try {
      // Attempt to create a date object. If dateStr is already yyyy-MM-dd, it's fine.
      // If it's an ISO string, it's also fine.
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) { // Check if date is valid
        throw new Error('Invalid date string provided');
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formatting date:", e, "Original string:", dateStr);
      return new Date().toISOString().split('T')[0]; // Fallback to today on error
    }
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      console.log('Reservation form is invalid');
      Object.values(form.controls).forEach(control => { // Use Object.values
        control.markAsTouched();
      });
      return;
    }
    this.saveReservation.emit(this.reservationData);
  }
}
