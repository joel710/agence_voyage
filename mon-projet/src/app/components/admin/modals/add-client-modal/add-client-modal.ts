import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added OnChanges, SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface ClientData {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  sexe: 'Homme' | 'Femme' | 'Autre' | '';
  dateNaissance?: string;
  login: string;
  password?: string;
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
      this.clientData = { ...this.clientToEdit };
      // Password should typically not be pre-filled for editing for security
      // and to prevent accidental overwrite if not changed.
      // It's also conditionally required in the template.
      delete this.clientData.password;
    } else {
      this.modalTitle = 'Ajouter un client';
      this.clientData = this.getInitialClientData();
    }
  }

  getInitialClientData(): ClientData {
    return {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      sexe: '', // Default to empty string to match <option value="">
      dateNaissance: '',
      login: '',
      password: '' // Password is required for new client via template's [required]
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
