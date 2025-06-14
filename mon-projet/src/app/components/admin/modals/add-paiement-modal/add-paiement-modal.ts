import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface BasicReservationInfo { id: string; label: string; }
export interface BasicAgentInfo { id: string; name: string; }

export interface PaiementData {
  id?: string;
  codePaiement: string;
  datePaiement: string;
  montant: number;
  reservationId: string;
  agentId: string;
  methode: 'Carte de crédit' | 'Virement bancaire' | 'Mobile Money' | 'Espèces' | '';
}

@Component({
  selector: 'app-add-paiement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-paiement-modal.html', // Corrected
  styleUrls: ['./add-paiement-modal.css']  // Corrected
})
export class AddPaiementModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() paiementToEdit: PaiementData | null = null;
  @Input() availableReservations: BasicReservationInfo[] = [];
  @Input() availableAgents: BasicAgentInfo[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() savePaiement = new EventEmitter<PaiementData>();

  modalTitle: string = 'Ajouter un Paiement';
  paiementData: PaiementData = this.getInitialPaiementData();

  constructor() {}

  ngOnInit(): void {
    this.initializePaiementData();
  }

  ngOnChanges(changes: SimpleChanges): void { // Added SimpleChanges type
    if (changes['paiementToEdit']) { // Check specific input property
      this.initializePaiementData();
    }
  }

  private initializePaiementData(): void {
    if (this.paiementToEdit) {
      this.modalTitle = 'Modifier le Paiement';
      this.paiementData = {
        ...this.paiementToEdit,
        datePaiement: this.formatDateForInput(this.paiementToEdit.datePaiement)
      };
    } else {
      this.modalTitle = 'Ajouter un Paiement';
      this.paiementData = this.getInitialPaiementData();
    }
  }

  getInitialPaiementData(): PaiementData {
    return {
      codePaiement: '',
      datePaiement: this.formatDateForInput(new Date().toISOString()),
      montant: 0,
      reservationId: '',
      agentId: '',
      methode: ''
    };
  }

  private formatDateForInput(dateStr?: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string provided');
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formatting date:", e, "Original string:", dateStr);
      return new Date().toISOString().split('T')[0];
    }
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      console.log('Paiement form is invalid');
      Object.values(form.controls).forEach(control => { // Use Object.values
        control.markAsTouched();
      });
      return;
    }
    this.savePaiement.emit(this.paiementData);
  }
}
