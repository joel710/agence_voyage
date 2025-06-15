import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core'; // Added ElementRef, ViewChild
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent, NavItem } from '../../components/admin-sidebar/admin-sidebar';
import { AdminTopbarComponent } from '../../components/admin-topbar/admin-topbar';
import Chart from 'chart.js/auto'; // Ensure this import is present

// Import Modal Components
import { AddClientModalComponent, ClientData as AddClientModalClientData } from '../../components/admin/modals/add-client-modal/add-client-modal'; // Renamed to avoid conflict
import { AddAgentModalComponent, AgentData as AddAgentModalAgentData } from '../../components/admin/modals/add-agent-modal/add-agent-modal'; // Aliased for clarity
import { AddVoyageModalComponent, VoyageData } from '../../components/admin/modals/add-voyage-modal/add-voyage-modal';
import { AddTypeBilletModalComponent, TypeBilletData } from '../../components/admin/modals/add-type-billet-modal/add-type-billet-modal';
import { AddReservationModalComponent, ReservationData, BasicClientInfo, BasicVoyageInfo, BasicTypeBilletInfo } from '../../components/admin/modals/add-reservation-modal/add-reservation-modal';
import { AddPaiementModalComponent, PaiementData, BasicReservationInfo, BasicAgentInfo } from '../../components/admin/modals/add-paiement-modal/add-paiement-modal';
import { DeleteConfirmationModalComponent } from '../../components/admin/modals/delete-confirmation-modal/delete-confirmation-modal';
import { ClientService, ClientDTO, Client } from '../../services/client.service';
import { AgentService, AgentDTO } from '../../services/agent.service'; // Added AgentService and AgentDTO

export interface LatestReservation {
  clientName: string; clientEmail: string; clientImage: string;
  destination: string; date: string; status: string; statusClass: string;
}

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [
    CommonModule, AdminSidebarComponent, AdminTopbarComponent,
    AddClientModalComponent, AddAgentModalComponent, AddVoyageModalComponent, AddTypeBilletModalComponent,
    AddReservationModalComponent, AddPaiementModalComponent, DeleteConfirmationModalComponent
  ],
  templateUrl: './admin-dashboard.html', // Corrected
  styleUrls: ['./admin-dashboard.css']  // Corrected
})
export class AdminDashboardPageComponent implements OnInit, OnDestroy, AfterViewInit {
  // Existing properties for sidebar, topbar, section, modals...
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  isMobileView = false;
  currentPageTitle: string = 'Tableau de bord';
  adminUserName: string = 'Admin User';
  adminUserRole: string = 'Administrator';
  currentSection: string = 'dashboard';

  private chart: Chart | undefined;
  @ViewChild('reservationsChartCanvas') reservationsChartCanvas: ElementRef<HTMLCanvasElement> | undefined;


  // Modal states
  isAddClientModalOpen = false;
  isAddAgentModalOpen = false;
  isAddVoyageModalOpen = false;
  isAddTypeBilletModalOpen = false;
  isAddReservationModalOpen = false;
  isAddPaiementModalOpen = false;
  isDeleteModalOpen = false;

  clientToEdit: ClientDTO | null = null;
  agentToEdit: AgentDTO | null = null; // Changed type to AgentDTO
  voyageToEdit: VoyageData | null = null;
  typeBilletToEdit: TypeBilletData | null = null;
  reservationToEdit: ReservationData | null = null;
  paiementToEdit: PaiementData | null = null;

  itemToDeleteId: string | number | null = null; // Allow number
  itemToDeleteName: string = '';
  deleteAction: (() => void) | null = null;

  sampleClientsForModal: BasicClientInfo[] = [];
  sampleVoyagesForModal: BasicVoyageInfo[] = [];
  sampleBilletsForModal: BasicTypeBilletInfo[] = [];
  sampleReservationsForModal: BasicReservationInfo[] = [];
  sampleAgentsForModal: BasicAgentInfo[] = [];

  latestReservations: LatestReservation[] = [];
  clientsList: ClientDTO[] = [];
  agentsList: AgentDTO[] = []; // Changed type to AgentDTO[]
  voyagesList: VoyageData[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private clientService: ClientService,
    private agentService: AgentService // Injected AgentService
  ) { }

  ngOnInit(): void {
    this.checkIfMobileView();
    this.populateSampleData();
    this.loadClients();
    this.loadAgents(); // Added call to loadAgents
  }

  ngAfterViewInit(): void {
    if (this.currentSection === 'dashboard') {
      this.initChart();
    }
  }

  populateSampleData(): void {
    this.latestReservations = [
      { clientName: 'Sophie Martin', clientEmail: 'sophie@example.com', clientImage: 'https://randomuser.me/api/portraits/women/12.jpg', destination: 'Paris, France', date: '15/07/2023', status: 'Confirmée', statusClass: 'bg-green-100 text-green-800' },
      { clientName: 'Jean Dupont', clientEmail: 'jean@example.com', clientImage: 'https://randomuser.me/api/portraits/men/42.jpg', destination: 'New York, USA', date: '22/07/2023', status: 'En attente', statusClass: 'bg-yellow-100 text-yellow-800' }
    ];
    // Removed direct population of this.clientsList and this.sampleClientsForModal
    // Sample data for voyagesList
    this.voyagesList = [
      { id: 'voyage1', lieuDepart: 'Paris', lieuArrivee: 'New York', dateVoyage: '2024-09-15', prix: 550.00, placesDisponibles: 30 },
      { id: 'voyage2', lieuDepart: 'Lyon', lieuArrivee: 'Rome', dateVoyage: '2024-10-20', prix: 275.50, placesDisponibles: 15 }
    ];
    this.sampleVoyagesForModal = this.voyagesList.map(v => ({
      id: v.id!,
      label: `${v.lieuDepart} -> ${v.lieuArrivee} (${new Date(v.dateVoyage).toLocaleDateString()})`
    }));
    this.sampleBilletsForModal = [{ id: 'b1', libelle: 'Eco' }, { id: 'b2', libelle: 'Business' }];
    this.sampleReservationsForModal = [{ id: 'r1', label: 'RES001 - S.Martin' }, { id: 'r2', label: 'RES002 - J.Dupont' }];
    // Removed direct population of this.agentsList and this.sampleAgentsForModal
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void { this.checkIfMobileView(); }

  checkIfMobileView(): void {
    const wasMobile = this.isMobileView;
    this.isMobileView = window.innerWidth < 768;
    if (wasMobile !== this.isMobileView) {
      if (this.isMobileView && this.isSidebarCollapsed && !this.isMobileSidebarOpen) {
        this.isSidebarCollapsed = false;
      } else if (!this.isMobileView) {
        this.isMobileSidebarOpen = false;
      }
    }
    // Removed cdr.detectChanges() as it might be problematic if not needed or cause change detection cycles.
    // Angular should pick up changes to isMobileView. If issues arise, it can be re-added.
  }

  toggleSidebar(): void {
    if (this.isMobileView) { this.isMobileSidebarOpen = !this.isMobileSidebarOpen; }
    else { this.isSidebarCollapsed = !this.isSidebarCollapsed; }
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    if (this.isMobileSidebarOpen && !this.isMobileView) { this.isSidebarCollapsed = false; }
  }

  onSectionNavigate(item: NavItem): void {
    this.currentPageTitle = item.label;
    const newSection = item.sectionId || 'dashboard';
    if (this.currentSection !== newSection && this.currentSection === 'dashboard') {
      this.destroyChart();
    }
    this.currentSection = newSection;
    if (this.isMobileView) {
      this.isMobileSidebarOpen = false;
    }
    if (this.currentSection === 'dashboard') {
      setTimeout(() => this.initChart(), 0);
    }
  }

  openAddClientModal(): void { this.clientToEdit = null; this.isAddClientModalOpen = true; }
  // Parameter is ClientDTO. clientToEdit is ClientDTO | null.
  // The modal's @Input() clientToEdit expects AddClientModalClientData.
  // Since AddClientModalClientData (modal) and ClientDTO (service) are now structurally similar
  // (idClient, nomClient etc.), direct assignment should largely work.
  openEditClientModal(client: ClientDTO): void {
    this.clientToEdit = client; // clientToEdit is now ClientDTO | null
    this.isAddClientModalOpen = true;
  }
  closeClientModal(): void { this.isAddClientModalOpen = false; this.clientToEdit = null; }
  handleSaveClient(clientFormData: AddClientModalClientData): void {
    // Map AddClientModalClientData from modal to ClientDTO or Client for the service
    const clientPayload: Client = { // Use Client interface for create
      idClient: clientFormData.idClient,
      nomClient: clientFormData.nomClient,
      prenomClient: clientFormData.prenomClient,
      mailClient: clientFormData.mailClient,
      telClient: clientFormData.telClient || '',
      sexeClient: clientFormData.sexeClient || '',
      dateNaiss: clientFormData.dateNaiss || '',
      login: clientFormData.login,
    };
    if (clientFormData.password) {
      clientPayload.password = clientFormData.password;
    }

    if (clientFormData.idClient) { // Update existing client
      const updatePayload: ClientDTO = { ...clientPayload };
      delete updatePayload.password;

      this.clientService.updateClient(clientFormData.idClient, updatePayload).subscribe({
        next: () => {
          this.showNotification(`Client ${clientPayload.prenomClient} ${clientPayload.nomClient} mis à jour.`);
          this.loadClients(); // Refresh list
        },
        error: (err) => {
          console.error('Error updating client:', err);
          this.showNotification('Erreur lors de la mise à jour du client.');
        },
        complete: () => this.closeClientModal()
      });
    } else { // Create new client
      this.clientService.createClient(clientPayload).subscribe({
        next: () => {
          this.showNotification(`Client ${clientPayload.prenomClient} ${clientPayload.nomClient} créé.`);
          this.loadClients(); // Refresh list
        },
        error: (err) => {
          console.error('Error creating client:', err);
          this.showNotification('Erreur lors de la création du client.');
        },
        complete: () => this.closeClientModal()
      });
    }
  }

  openAddAgentModal(): void { this.agentToEdit = null; this.isAddAgentModalOpen = true; }
  openEditAgentModal(agent: AgentDTO): void {
    this.agentToEdit = agent;
    this.isAddAgentModalOpen = true;
  }
  closeAgentModal(): void { this.isAddAgentModalOpen = false; this.agentToEdit = null; }
  handleSaveAgent(agentFormData: AddAgentModalAgentData): void {
    // Map AgentData from modal to AgentDTO for the service
    const agentPayload: AgentDTO = {
      idAgent: agentFormData.idAgent,
      nomAgent: agentFormData.nomAgent,
      prenomAgent: agentFormData.prenomAgent,
      mailAgent: agentFormData.mailAgent,
      telAgent: agentFormData.telAgent || undefined,
      sexeAgent: agentFormData.sexeAgent,
      dateNaiss: agentFormData.dateNaiss || undefined,
      role: agentFormData.role, // Added role assignment
    };

    if (agentPayload.idAgent) { // Update existing agent
      this.agentService.updateAgent(agentPayload.idAgent, agentPayload).subscribe({
        next: () => {
          this.showNotification(`Agent ${agentPayload.prenomAgent} ${agentPayload.nomAgent} mis à jour.`);
          this.loadAgents(); // Refresh list
        },
        error: (err) => {
          console.error('Error updating agent:', err);
          this.showNotification('Erreur lors de la mise à jour de l\'agent.');
        },
        complete: () => this.closeAgentModal()
      });
    } else { // Create new agent
      this.agentService.createAgent(agentPayload).subscribe({
        next: (createdAgent) => {
          this.showNotification(`Agent ${createdAgent.prenomAgent} ${createdAgent.nomAgent} créé.`);
          this.loadAgents(); // Refresh list
        },
        error: (err) => {
          console.error('Error creating agent:', err);
          this.showNotification('Erreur lors de la création de l\'agent.');
        },
        complete: () => this.closeAgentModal()
      });
    }
  }

  openAddVoyageModal(): void { this.voyageToEdit = null; this.isAddVoyageModalOpen = true; }
  openEditVoyageModal(voyage: VoyageData): void { this.voyageToEdit = voyage; this.isAddVoyageModalOpen = true; }
  closeVoyageModal(): void { this.isAddVoyageModalOpen = false; this.voyageToEdit = null; }
  handleSaveVoyage(voyage: VoyageData): void {
    if (voyage.id) { // Existing voyage
      const index = this.voyagesList.findIndex(v => v.id === voyage.id);
      if (index > -1) {
        this.voyagesList[index] = voyage;
      }
    } else { // New voyage
      voyage.id = `voyage${Date.now().toString()}`; // Simple unique ID
      this.voyagesList.push(voyage);
    }
    // Update sampleVoyagesForModal as well
    this.sampleVoyagesForModal = this.voyagesList.map(v => ({
      id: v.id!,
      label: `${v.lieuDepart} -> ${v.lieuArrivee} (${new Date(v.dateVoyage).toLocaleDateString()})`
    }));
    this.showNotification(`Voyage pour ${voyage.lieuArrivee} enregistré.`);
    this.closeVoyageModal();
  }

  openAddTypeBilletModal(): void { this.typeBilletToEdit = null; this.isAddTypeBilletModalOpen = true; }
  openEditTypeBilletModal(billet: TypeBilletData): void { this.typeBilletToEdit = billet; this.isAddTypeBilletModalOpen = true; }
  closeTypeBilletModal(): void { this.isAddTypeBilletModalOpen = false; this.typeBilletToEdit = null; }
  handleSaveTypeBillet(billet: TypeBilletData): void { console.log('Saving type billet:', billet); this.closeTypeBilletModal(); this.showNotification('Type de billet enregistré.'); }

  openAddReservationModal(): void { this.reservationToEdit = null; this.isAddReservationModalOpen = true; }
  openEditReservationModal(reservation: ReservationData): void { this.reservationToEdit = reservation; this.isAddReservationModalOpen = true; }
  closeReservationModal(): void { this.isAddReservationModalOpen = false; this.reservationToEdit = null; }
  handleSaveReservation(reservation: ReservationData): void { this.closeReservationModal(); this.showNotification('Réservation enregistrée.'); }

  openAddPaiementModal(): void { this.paiementToEdit = null; this.isAddPaiementModalOpen = true; }
  openEditPaiementModal(paiement: PaiementData): void { this.paiementToEdit = paiement; this.isAddPaiementModalOpen = true; }
  closePaiementModal(): void { this.isAddPaiementModalOpen = false; this.paiementToEdit = null; }
  handleSavePaiement(paiement: PaiementData): void { this.closePaiementModal(); this.showNotification('Paiement enregistré.'); }

  openDeleteModal(id: string | number, name: string, deleteLogic: () => void): void {
    this.itemToDeleteId = id; this.itemToDeleteName = name; this.deleteAction = deleteLogic; this.isDeleteModalOpen = true;
  }
  closeDeleteModal(): void { this.isDeleteModalOpen = false; this.itemToDeleteId = null; this.itemToDeleteName = ''; this.deleteAction = null; }
  handleConfirmDelete(): void {
    if (this.deleteAction) { this.deleteAction(); this.showNotification(`${this.itemToDeleteName} supprimé.`);}
    this.closeDeleteModal();
  }
  deleteClientAction(clientId: number): void { // Parameter changed to number
    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        // Notification is handled by handleConfirmDelete
        this.loadClients(); // Refresh list
      },
      error: (err) => {
        console.error('Error deleting client:', err);
        this.showNotification('Erreur lors de la suppression du client.');
        this.closeDeleteModal(); // Close modal even on error, or handle differently
      }
    });
  }

  showNotification(message: string): void {
    const notificationElement = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    if (notificationElement && messageElement) {
        messageElement.textContent = message;
        notificationElement.classList.remove('hidden');
        setTimeout(() => {
            notificationElement.classList.add('hidden');
        }, 3000);
    } else {
      console.log('Notification elements not found. Message:', message);
    }
  }

  initChart(): void {
    this.destroyChart();
    if (this.reservationsChartCanvas && this.reservationsChartCanvas.nativeElement) {
      const canvas = this.reservationsChartCanvas.nativeElement;
      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [{
            label: 'Réservations',
            data: [12, 19, 15, 20, 25, 30, 35, 40, 32, 28, 22, 18],
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
        }
      });
      this.cdr.detectChanges();
    } else {
        // console.warn('Chart canvas #reservationsChartCanvas not found yet.');
        // It's possible ngAfterViewInit runs before *ngIf="currentSection === 'dashboard'" makes it visible.
        // The setTimeout in onSectionNavigate should handle this if navigating to dashboard.
        // If dashboard is default, this should ideally find it.
    }
  }

  destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
      console.log('Chart destroyed');
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clientsList = data;
        this.sampleClientsForModal = data.map(c => ({
          id: c.idClient!.toString(), // BasicClientInfo expects id as string
          name: `${c.prenomClient} ${c.nomClient}`
        }));
        console.log('Clients loaded:', this.clientsList);
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.showNotification('Erreur lors du chargement des clients.');
      }
    });
  }

  onDeleteClient(client: ClientDTO): void { // Parameter type is now ClientDTO
    if (client.idClient) { // Check idClient
      this.openDeleteModal(client.idClient, `${client.prenomClient} ${client.nomClient}`, () => this.deleteClientAction(client.idClient!));
    } else {
      console.error("Client ID is missing, cannot delete.");
      this.showNotification("Erreur: ID du client manquant.");
    }
  }

  // Agent Delete Logic
  deleteAgentAction(agentId: number): void { // Parameter changed to number
    this.agentService.deleteAgent(agentId).subscribe({
      next: () => {
        this.loadAgents(); // Refresh list
        // Notification is handled by handleConfirmDelete
      },
      error: (err) => {
        console.error('Error deleting agent:', err);
        this.showNotification('Erreur lors de la suppression de l\'agent.');
        this.closeDeleteModal();
      }
    });
  }

  onDeleteAgent(agent: AgentDTO): void { // Parameter type is now AgentDTO
    if (agent.idAgent) {
      this.openDeleteModal(agent.idAgent, `${agent.prenomAgent} ${agent.nomAgent}`, () => this.deleteAgentAction(agent.idAgent!));
    } else {
      console.error("Agent ID is missing, cannot delete.");
      this.showNotification("Erreur: ID de l'agent manquant.");
    }
  }

  // Voyage Delete Logic
  deleteVoyageAction(voyageId: string): void {
    this.voyagesList = this.voyagesList.filter(v => v.id !== voyageId);
    // Update sampleVoyagesForModal after deletion
    this.sampleVoyagesForModal = this.voyagesList.map(v => ({
      id: v.id!,
      label: `${v.lieuDepart} -> ${v.lieuArrivee} (${new Date(v.dateVoyage).toLocaleDateString()})`
    }));
    console.log(`Voyage with ID: ${voyageId} actioned for deletion.`);
  }

  onDeleteVoyage(voyage: VoyageData): void {
    if (voyage.id) {
      this.openDeleteModal(voyage.id, `Voyage ${voyage.lieuDepart} -> ${voyage.lieuArrivee}`, () => this.deleteVoyageAction(voyage.id!));
    } else {
      console.error("Voyage ID is missing, cannot delete.");
      this.showNotification("Erreur: ID du voyage manquant.");
    }
  }

  loadAgents(): void {
    this.agentService.getAllAgents().subscribe({
      next: (data) => {
        this.agentsList = data;
        // Update sampleAgentsForModal if it's used elsewhere
        this.sampleAgentsForModal = data.map(a => ({
          id: a.idAgent!.toString(),
          name: `${a.prenomAgent} ${a.nomAgent}`
        }));
        console.log('Agents loaded:', this.agentsList);
      },
      error: (err) => {
        console.error('Error loading agents:', err);
        this.showNotification('Erreur lors du chargement des agents.');
      }
    });
  }
}
