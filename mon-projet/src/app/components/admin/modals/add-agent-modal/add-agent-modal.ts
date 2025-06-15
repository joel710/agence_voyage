import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added SimpleChanges
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface AgentData {
  idAgent?: number; // Changed from id: string
  nomAgent: string;  // Changed from nom
  prenomAgent: string; // Changed from prenom
  sexeAgent: 'Homme' | 'Femme' | 'Autre' | ''; // Changed from sexe
  dateNaiss?: string; // Changed from dateNaissance, ensure yyyy-MM-dd format for API
  telAgent?: string; // Changed from telephone
  mailAgent: string; // Changed from email
  role: 'Agent' | 'Admin' | ''; // Kept for frontend form, may not map directly to AGENT entity
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
      // idAgent will be undefined for new agents
      nomAgent: '',
      prenomAgent: '',
      sexeAgent: '',
      dateNaiss: '',
      telAgent: '',
      mailAgent: '',
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
