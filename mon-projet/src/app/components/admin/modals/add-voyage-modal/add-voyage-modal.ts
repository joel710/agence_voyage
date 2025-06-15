import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface VoyageData {
  idVoyage?: number; // Changed from id: string
  departVoyage: string;  // Changed from lieuDepart
  arriveVoyage: string; // Changed from lieuArrivee
  dateVoyage: string; // Name is same, ensure yyyy-MM-dd format
  prix?: number; // Kept
  placesDisponibles?: number; // Kept
}

@Component({
  selector: 'app-add-voyage-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-voyage-modal.html', // Corrected
  styleUrls: ['./add-voyage-modal.css']  // Corrected
})
export class AddVoyageModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() voyageToEdit: VoyageData | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveVoyage = new EventEmitter<VoyageData>();

  modalTitle: string = 'Ajouter un Voyage';
  voyageData: VoyageData = this.getInitialVoyageData();

  constructor() {}

  ngOnInit(): void {
    this.initializeVoyageData();
  }

  ngOnChanges(changes: SimpleChanges): void { // Added SimpleChanges type
    if (changes['voyageToEdit']) { // Check specific input property
      this.initializeVoyageData();
    }
  }

  private initializeVoyageData(): void {
    if (this.voyageToEdit) {
      this.modalTitle = 'Modifier le Voyage';
      this.voyageData = {
        ...this.voyageToEdit,
        dateVoyage: this.formatDateForInput(this.voyageToEdit.dateVoyage)
      };
    } else {
      this.modalTitle = 'Ajouter un Voyage';
      this.voyageData = this.getInitialVoyageData();
    }
  }

  getInitialVoyageData(): VoyageData {
    return {
      // idVoyage will be undefined for new voyages
      departVoyage: '',
      arriveVoyage: '',
      dateVoyage: this.formatDateForInput(new Date().toISOString()),
      prix: 0,
      placesDisponibles: 0
    };
  }

  private formatDateForInput(dateInput?: string | Date): string {
    if (!dateInput) return '';
    try {
      // Ensure dateInput is a Date object or a string that can be parsed into one
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      // Check if the date is valid after parsing/conversion
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date input');
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date:', e);
      return ''; // Or handle error appropriately, e.g., return today's date formatted
    }
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      console.log('Voyage form is invalid');
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.saveVoyage.emit(this.voyageData);
  }
}
