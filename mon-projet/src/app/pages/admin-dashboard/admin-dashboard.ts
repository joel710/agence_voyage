import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core'; // Added ElementRef, ViewChild
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent, NavItem } from '../../components/admin-sidebar/admin-sidebar';
import { AdminTopbarComponent } from '../../components/admin-topbar/admin-topbar';
import Chart from 'chart.js/auto'; // Ensure this import is present

// Import Modal Components
import { AddClientModalComponent, ClientData as AddClientModalClientData } from '../../components/admin/modals/add-client-modal/add-client-modal'; // Renamed to avoid conflict
import { AddAgentModalComponent, AgentData as AddAgentModalAgentData } from '../../components/admin/modals/add-agent-modal/add-agent-modal'; // Aliased for clarity
import { AddVoyageModalComponent, VoyageData as AddVoyageModalVoyageData } from '../../components/admin/modals/add-voyage-modal/add-voyage-modal'; // Aliased
import { AddTypeBilletModalComponent, TypeBilletData as AddTypeBilletModalTypeBilletData } from '../../components/admin/modals/add-type-billet-modal/add-type-billet-modal'; // Aliased
import { AddReservationModalComponent, ReservationData, BasicClientInfo, BasicVoyageInfo, BasicTypeBilletInfo } from '../../components/admin/modals/add-reservation-modal/add-reservation-modal';
import { AddPaiementModalComponent, PaiementData, BasicReservationInfo, BasicAgentInfo } from '../../components/admin/modals/add-paiement-modal/add-paiement-modal';
import { DeleteConfirmationModalComponent } from '../../components/admin/modals/delete-confirmation-modal/delete-confirmation-modal';
import { ClientService, ClientDTO, Client } from '../../services/client.service';
import { AgentService, AgentDTO } from '../../services/agent.service';
import { VoyageService, VoyageDTO } from '../../services/voyage.service';
import { TypeBilletService, TypeBilletDTO } from '../../services/type-billet.service'; // Added TypeBilletService

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
  agentToEdit: AgentDTO | null = null;
  voyageToEdit: VoyageDTO | null = null;
  typeBilletToEdit: TypeBilletDTO | null = null; // Changed type to TypeBilletDTO
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
  agentsList: AgentDTO[] = [];
  voyagesList: VoyageDTO[] = [];
  typesBilletList: TypeBilletDTO[] = []; // Added typesBilletList

  constructor(
    private cdr: ChangeDetectorRef,
    private clientService: ClientService,
    private agentService: AgentService,
    private voyageService: VoyageService,
    private typeBilletService: TypeBilletService // Injected TypeBilletService
  ) { }

  ngOnInit(): void {
    this.checkIfMobileView();
    this.populateSampleData();
    this.loadClients();
    this.loadAgents();
    this.loadVoyages();
    this.loadTypesBillet(); // Added call to loadTypesBillet
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
    // Removed direct population of this.clientsList, this.sampleClientsForModal
    // Removed direct population of this.voyagesList and this.sampleVoyagesForModal
    // Removed direct population of this.agentsList and this.sampleAgentsForModal
    // Static sampleBilletsForModal will be replaced by loadTypesBillet
    this.sampleReservationsForModal = [{ id: 'r1', label: 'RES001 - S.Martin' }, { id: 'r2', label: 'RES002 - J.Dupont' }]; // Kept for now
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
  openEditVoyageModal(voyage: VoyageDTO): void {
    this.voyageToEdit = voyage;
    this.isAddVoyageModalOpen = true;
  }
  closeVoyageModal(): void { this.isAddVoyageModalOpen = false; this.voyageToEdit = null; }
  handleSaveVoyage(voyageFormData: AddVoyageModalVoyageData): void {
    const voyagePayload: VoyageDTO = {
      idVoyage: voyageFormData.idVoyage,
      departVoyage: voyageFormData.departVoyage,
      arriveVoyage: voyageFormData.arriveVoyage,
      dateVoyage: voyageFormData.dateVoyage, // Ensure format is yyyy-MM-dd
      prix: voyageFormData.prix,
      placesDisponibles: voyageFormData.placesDisponibles
    };

    if (voyagePayload.idVoyage) { // Update existing voyage
      this.voyageService.updateVoyage(voyagePayload.idVoyage, voyagePayload).subscribe({
        next: () => {
          this.showNotification(`Voyage vers ${voyagePayload.arriveVoyage} mis à jour.`);
          this.loadVoyages(); // Refresh list
        },
        error: (err) => {
          console.error('Error updating voyage:', err);
          this.showNotification('Erreur lors de la mise à jour du voyage.');
        },
        complete: () => this.closeVoyageModal()
      });
    } else { // Create new voyage
      this.voyageService.createVoyage(voyagePayload).subscribe({
        next: (createdVoyage) => {
          this.showNotification(`Voyage vers ${createdVoyage.arriveVoyage} créé.`);
          this.loadVoyages(); // Refresh list
        },
        error: (err) => {
          console.error('Error creating voyage:', err);
          this.showNotification('Erreur lors de la création du voyage.');
        },
        complete: () => this.closeVoyageModal()
      });
    }
  }

  openAddTypeBilletModal(): void { this.typeBilletToEdit = null; this.isAddTypeBilletModalOpen = true; }
  openEditTypeBilletModal(billet: TypeBilletDTO): void {
    this.typeBilletToEdit = billet;
    this.isAddTypeBilletModalOpen = true;
  }
  closeTypeBilletModal(): void { this.isAddTypeBilletModalOpen = false; this.typeBilletToEdit = null; }
  handleSaveTypeBillet(formData: AddTypeBilletModalTypeBilletData): void {
    const payload: TypeBilletDTO = {
      idTypeBillet: formData.idTypeBillet,
      libelleTypeBillet: formData.libelleTypeBillet,
      prixTypeBillet: formData.prixTypeBillet
    };

    if (payload.idTypeBillet) { // Update existing
      this.typeBilletService.updateTypeBillet(payload.idTypeBillet, payload).subscribe({
        next: () => {
          this.showNotification(`Type de billet '${payload.libelleTypeBillet}' mis à jour.`);
          this.loadTypesBillet();
        },
        error: (err) => {
          console.error('Error updating type billet:', err);
          this.showNotification('Erreur lors de la mise à jour du type de billet.');
        },
        complete: () => this.closeTypeBilletModal()
      });
    } else { // Create new
      this.typeBilletService.createTypeBillet(payload).subscribe({
        next: (created) => {
          this.showNotification(`Type de billet '${created.libelleTypeBillet}' créé.`);
          this.loadTypesBillet();
        },
        error: (err) => {
          console.error('Error creating type billet:', err);
          this.showNotification('Erreur lors de la création du type de billet.');
        },
        complete: () => this.closeTypeBilletModal()
      });
    }
  }

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
  deleteVoyageAction(voyageId: number): void { // Parameter changed to number
    this.voyageService.deleteVoyage(voyageId).subscribe({
      next: () => {
        this.loadVoyages(); // Refresh list
        // Notification handled by handleConfirmDelete
      },
      error: (err) => {
        console.error('Error deleting voyage:', err);
        this.showNotification('Erreur lors de la suppression du voyage.');
        this.closeDeleteModal();
      }
    });
  }

  onDeleteVoyage(voyage: VoyageDTO): void { // Parameter type is now VoyageDTO
    if (voyage.idVoyage) {
      this.openDeleteModal(voyage.idVoyage, `Voyage ${voyage.departVoyage} -> ${voyage.arriveVoyage}`, () => this.deleteVoyageAction(voyage.idVoyage!));
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

  loadVoyages(): void {
    this.voyageService.getAllVoyages().subscribe({
      next: (data) => {
        this.voyagesList = data;
        this.sampleVoyagesForModal = data.map(v => ({
          id: v.idVoyage!.toString(),
          label: `${v.departVoyage} -> ${v.arriveVoyage} (${new Date(v.dateVoyage).toLocaleDateString()})`
        }));
        console.log('Voyages loaded:', this.voyagesList);
      },
      error: (err) => {
        console.error('Error loading voyages:', err);
        this.showNotification('Erreur lors du chargement des voyages.');
      }
    });
  }

  loadTypesBillet(): void {
    this.typeBilletService.getAllTypesBillet().subscribe({
      next: (data) => {
        this.typesBilletList = data;
        // Update sampleBilletsForModal based on the fetched data
        this.sampleBilletsForModal = data.map(tb => ({
          id: tb.idTypeBillet!.toString(),
          libelle: tb.libelleTypeBillet
        }));
        console.log('Types Billet loaded:', this.typesBilletList);
      },
      error: (err) => {
        console.error('Error loading types billet:', err);
        this.showNotification('Erreur lors du chargement des types de billet.');
      }
    });
  }

  // Placeholder for onDeleteTypeBillet - to be implemented if HTML has delete buttons for types billets
  deleteTypeBilletAction(idTypeBillet: number): void {
    this.typeBilletService.deleteTypeBillet(idTypeBillet).subscribe({
      next: (success) => {
        if (success) {
          this.loadTypesBillet();
        } else {
          console.error('Failed to delete type billet (backend returned false).');
          this.showNotification('La suppression du type de billet a échoué.');
        }
        this.closeDeleteModal(); // Close modal regardless of backend boolean success for now
      },
      error: (err) => {
        console.error('Error deleting type billet:', err);
        this.showNotification('Erreur lors de la suppression du type de billet.');
        this.closeDeleteModal();
      }
    });
  }

  onDeleteTypeBillet(typeBillet: TypeBilletDTO): void {
    if (typeBillet.idTypeBillet) {
      this.openDeleteModal(typeBillet.idTypeBillet, `Type Billet: ${typeBillet.libelleTypeBillet}`, () => this.deleteTypeBilletAction(typeBillet.idTypeBillet!));
    } else {
      console.error("TypeBillet ID is missing, cannot delete.");
      this.showNotification("Erreur: ID du type de billet manquant.");
    }
  }
}
