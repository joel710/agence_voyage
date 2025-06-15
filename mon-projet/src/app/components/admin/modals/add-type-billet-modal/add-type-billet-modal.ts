import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface TypeBilletData {
  idTypeBillet?: number; // Changed from id: string
  libelleTypeBillet: string;  // Changed from libelle
  prixTypeBillet: number; // Changed from prix
  // description?: string; // Removed as it's not in backend TYPE_BILLET entity
}

@Component({
  selector: 'app-add-type-billet-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-type-billet-modal.html', // Corrected
  styleUrls: ['./add-type-billet-modal.css']  // Corrected
})
export class AddTypeBilletModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() typeBilletToEdit: TypeBilletData | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTypeBillet = new EventEmitter<TypeBilletData>();

  modalTitle: string = 'Ajouter un Type de Billet';
  typeBilletData: TypeBilletData = this.getInitialTypeBilletData();

  constructor() {}

  ngOnInit(): void {
    this.initializeTypeBilletData();
  }

  ngOnChanges(changes: SimpleChanges): void { // Added SimpleChanges type
    if (changes['typeBilletToEdit']) { // Check specific input property
      this.initializeTypeBilletData();
    }
  }

  private initializeTypeBilletData(): void {
    if (this.typeBilletToEdit) {
      this.modalTitle = 'Modifier le Type de Billet';
      this.typeBilletData = { ...this.typeBilletToEdit };
    } else {
      this.modalTitle = 'Ajouter un Type de Billet';
      this.typeBilletData = this.getInitialTypeBilletData();
    }
  }

  getInitialTypeBilletData(): TypeBilletData {
    return {
      // idTypeBillet will be undefined for new types
      libelleTypeBillet: '',
      prixTypeBillet: 0
      // description: '' // Removed
    };
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      console.log('Type Billet form is invalid');
      Object.values(form.controls).forEach(control => { // Use Object.values
        control.markAsTouched();
      });
      return;
    }
    this.saveTypeBillet.emit(this.typeBilletData);
  }
}
