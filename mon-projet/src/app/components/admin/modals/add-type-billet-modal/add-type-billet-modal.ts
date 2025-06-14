import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface TypeBilletData {
  id?: string;
  libelle: string;
  prix: number;
  description?: string;
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
      libelle: '',
      prix: 0,
      description: ''
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
