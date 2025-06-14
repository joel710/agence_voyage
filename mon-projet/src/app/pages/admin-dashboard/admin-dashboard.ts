import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core'; // Added ElementRef, ViewChild
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent, NavItem } from '../../components/admin-sidebar/admin-sidebar';
import { AdminTopbarComponent } from '../../components/admin-topbar/admin-topbar';
import Chart from 'chart.js/auto'; // Ensure this import is present

// Import Modal Components
import { AddClientModalComponent, ClientData } from '../../components/admin/modals/add-client-modal/add-client-modal';
import { AddAgentModalComponent, AgentData } from '../../components/admin/modals/add-agent-modal/add-agent-modal';
import { AddVoyageModalComponent, VoyageData } from '../../components/admin/modals/add-voyage-modal/add-voyage-modal';
import { AddTypeBilletModalComponent, TypeBilletData } from '../../components/admin/modals/add-type-billet-modal/add-type-billet-modal';
import { AddReservationModalComponent, ReservationData, BasicClientInfo, BasicVoyageInfo, BasicTypeBilletInfo } from '../../components/admin/modals/add-reservation-modal/add-reservation-modal';
import { AddPaiementModalComponent, PaiementData, BasicReservationInfo, BasicAgentInfo } from '../../components/admin/modals/add-paiement-modal/add-paiement-modal';
import { DeleteConfirmationModalComponent } from '../../components/admin/modals/delete-confirmation-modal/delete-confirmation-modal';

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

  clientToEdit: ClientData | null = null;
  agentToEdit: AgentData | null = null;
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
  clientsList: ClientData[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.checkIfMobileView();
    this.populateSampleData();
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
    this.clientsList = [
      { id: '1', nom: 'Martin', prenom: 'Sophie', email: 'sophie@example.com', telephone: '06 12 34 56 78', sexe: 'Femme', dateNaissance: '1990-01-01', login: 'sophieM' }, // Removed avatar, not in ClientData
      { id: '2', nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com', telephone: '07 89 01 23 45', sexe: 'Homme', dateNaissance: '1985-05-05', login: 'jeanD' }, // Removed avatar
    ];
    this.sampleClientsForModal = this.clientsList.map(c => ({ id: c.id!, name: `${c.prenom} ${c.nom}` }));
    this.sampleVoyagesForModal = [{ id: 'v1', label: 'Paris -> NYC (20/12/2023)' }, { id: 'v2', label: 'Lyon -> Rome (15/01/2024)' }];
    this.sampleBilletsForModal = [{ id: 'b1', libelle: 'Eco' }, { id: 'b2', libelle: 'Business' }];
    this.sampleReservationsForModal = [{ id: 'r1', label: 'RES001 - S.Martin' }, { id: 'r2', label: 'RES002 - J.Dupont' }];
    this.sampleAgentsForModal = [{ id: 'ag1', name: 'Agent Smith' }, { id: 'ag2', name: 'Agent Jones' }];
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
  openEditClientModal(client: ClientData): void { this.clientToEdit = client; this.isAddClientModalOpen = true; }
  closeClientModal(): void { this.isAddClientModalOpen = false; this.clientToEdit = null; }
  handleSaveClient(client: ClientData): void {
    console.log('Saving client:', client);
    if (client.id) {
      const index = this.clientsList.findIndex(c => c.id === client.id);
      if (index > -1) this.clientsList[index] = client;
    } else {
      this.clientsList.push({ ...client, id: Date.now().toString() }); // ClientData doesn't have avatar, so removed assignment
    }
    this.showNotification(`Client ${client.prenom} ${client.nom} enregistré.`);
    this.closeClientModal();
  }

  openAddAgentModal(): void { this.agentToEdit = null; this.isAddAgentModalOpen = true; }
  openEditAgentModal(agent: AgentData): void { this.agentToEdit = agent; this.isAddAgentModalOpen = true; }
  closeAgentModal(): void { this.isAddAgentModalOpen = false; this.agentToEdit = null; }
  handleSaveAgent(agent: AgentData): void { console.log('Saving agent:', agent); this.closeAgentModal(); this.showNotification('Agent enregistré.'); }

  openAddVoyageModal(): void { this.voyageToEdit = null; this.isAddVoyageModalOpen = true; }
  openEditVoyageModal(voyage: VoyageData): void { this.voyageToEdit = voyage; this.isAddVoyageModalOpen = true; }
  closeVoyageModal(): void { this.isAddVoyageModalOpen = false; this.voyageToEdit = null; }
  handleSaveVoyage(voyage: VoyageData): void { console.log('Saving voyage:', voyage); this.closeVoyageModal(); this.showNotification('Voyage enregistré.'); }

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
  deleteClientAction(clientId: string): void {
    this.clientsList = this.clientsList.filter(c => c.id !== clientId);
    console.log(`Client with ID: ${clientId} would be deleted.`);
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

  onDeleteClient(client: ClientData): void {
    this.openDeleteModal(client.id!, client.prenom + ' ' + client.nom, () => this.deleteClientAction(client.id!));
  }
}
