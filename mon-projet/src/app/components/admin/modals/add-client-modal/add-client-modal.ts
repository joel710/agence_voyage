import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added OnChanges, SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface ClientData {
  idClient?: number; // Changed from id: string, to match backend Long/number
  nomClient: string;  // Changed from nom
  prenomClient: string; // Changed from prenom
  mailClient: string; // Changed from email
  telClient?: string; // Changed from telephone
  sexeClient: 'Homme' | 'Femme' | 'Autre' | ''; // Changed from sexe
  dateNaiss?: string; // Changed from dateNaissance, ensure yyyy-MM-dd format for API
  login: string; // No change
  password?: string; // No change, optional for DTOs (especially for GET/PUT responses)
}

@Component({
  selector: 'app-add-client-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-client-modal.html', // Corrected
  styleUrls: ['./add-client-modal.css']  // Corrected
})
export class AddClientModalComponent implements OnInit, OnChanges { // Added OnChanges
  @Input() isOpen: boolean = false;
  @Input() clientToEdit: ClientData | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveClient = new EventEmitter<ClientData>();

  modalTitle: string = 'Ajouter un client';
  clientData: ClientData = this.getInitialClientData();

  constructor() {}

  ngOnInit(): void {
    this.updateModalState();
  }

  ngOnChanges(changes: SimpleChanges): void { // Use SimpleChanges type
    if (changes['clientToEdit']) { // Check specific input property
      this.updateModalState();
    }
  }

  private updateModalState(): void {
    if (this.clientToEdit) {
      this.modalTitle = 'Modifier le client';
      // When editing, map existing ClientData (if it's still using old names from parent)
      // to new ClientData structure. Or assume clientToEdit already conforms.
      // For safety, let's assume clientToEdit might be in old format if this component
      // is updated before its parent passes data in new format.
      // However, the problem implies clientToEdit will conform, so direct spread is fine.
      this.clientData = { ...this.clientToEdit };
      // Password should typically not be pre-filled for editing for security
      // and to prevent accidental overwrite if not changed.
      delete this.clientData.password;
    } else {
      this.modalTitle = 'Ajouter un client';
      this.clientData = this.getInitialClientData();
    }
  }

  getInitialClientData(): ClientData {
    return {
      // idClient will be undefined for new clients
      nomClient: '',
      prenomClient: '',
      mailClient: '',
      telClient: '',
      sexeClient: '',
      dateNaiss: '', // Ensure this is handled as yyyy-MM-dd if a date input is bound to it
      login: '',
      password: ''
    };
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      // Mark all fields as touched to display validation messages if not already done by Angular
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      console.log('Client form is invalid');
      return;
    }
    this.saveClient.emit(this.clientData);
  }
}
