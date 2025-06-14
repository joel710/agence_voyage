import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface AgentData {
  id?: string;
  nom: string;
  prenom: string;
  sexe: 'Homme' | 'Femme' | 'Autre' | '';
  dateNaissance?: string;
  telephone?: string;
  email: string;
  role: 'Agent' | 'Admin' | '';
  // Add password fields if agents have separate logins managed here
}

@Component({
  selector: 'app-add-agent-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-agent-modal.html', // Corrected
  styleUrls: ['./add-agent-modal.css']  // Corrected
})
export class AddAgentModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() agentToEdit: AgentData | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveAgent = new EventEmitter<AgentData>();

  modalTitle: string = 'Ajouter un Agent';
  agentData: AgentData = this.getInitialAgentData();

  constructor() {}

  ngOnInit(): void {
    this.initializeAgentData();
  }

  ngOnChanges(changes: SimpleChanges): void { // Added SimpleChanges type
    if (changes['agentToEdit']) { // Check specific input property
      this.initializeAgentData();
    }
  }

  private initializeAgentData(): void {
    if (this.agentToEdit) {
      this.modalTitle = 'Modifier l\'Agent';
      this.agentData = { ...this.agentToEdit };
    } else {
      this.modalTitle = 'Ajouter un Agent';
      this.agentData = this.getInitialAgentData();
    }
  }

  getInitialAgentData(): AgentData {
    return {
      nom: '',
      prenom: '',
      sexe: '',
      dateNaissance: '',
      telephone: '',
      email: '',
      role: ''
    };
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      console.log('Agent form is invalid');
      // Mark all fields as touched to show errors
      Object.values(form.controls).forEach(control => { // Use Object.values for iterating controls
        control.markAsTouched();
      });
      return;
    }
    this.saveAgent.emit(this.agentData);
  }
}
