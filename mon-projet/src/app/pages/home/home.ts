import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

interface Offer {
  imageUrl: string;
  altText: string;
  name: string;
  isNew?: boolean;
  details: string;
  price: string;
}

interface DestinationDeal {
  imageUrl: string;
  altText: string;
  name: string;
  details: string;
  price: string;
  link: string; // Assuming routerLink for now
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './home.html', // Corrected
  styleUrls: ['./home.css']  // Corrected
})
export class HomePageComponent implements OnInit, OnDestroy {

  countdownDays: string = '00';
  countdownHours: string = '00';
  countdownMinutes: string = '00';
  private countdownInterval: any;

  faqItems: { question: string, answer: string, isOpen?: boolean }[] = [];

  topOffers: Offer[] = [];
  cheapFlightsFrance: DestinationDeal[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateFaqItems();
    this.populateTopOffers();
    this.populateCheapFlightsFrance();
    // Countdown timer logic will be implemented in Step 8
    // FAQ toggle logic is already in place
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  populateFaqItems(): void {
    this.faqItems = [
      { question: 'Comment Ma djo laa trouve-t-il des billets moins chers?', answer: 'Nous avons développé une technologie qui scanne en temps réel des centaines de compagnies aériennes et agences de voyage pour identifier les meilleures offres disponibles le moment où vous effectuez votre recherche.' },
      { question: 'Quel est le meilleur moment pour réserver un vol pas cher?', answer: 'Généralement, réserver entre 6 et 8 semaines avant le départ est optimal. Nous recommandons également d\'utiliser nos alertes prix pour être averti quand les tarifs baissent sur vos destinations favorites.' },
      { question: 'Puis-je réserver directement sur Ma djo laa ?', answer: 'Ma djo laa est un comparateur et non un vendeur. Une fois que vous avez trouvé votre vol idéal, nous vous redirigeons vers le site du partenaire pour finaliser votre réservation.' }
    ];
  }

  populateTopOffers(): void {
    this.topOffers = [
      { imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Marseille', name: 'Marseille', isNew: true, details: '2 mai - 8 mai • 6 jours', price: '790 000 FCFA' },
      { imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Nice', name: 'Nice', details: '24 mai - 30 mai • 6 jours', price: '710 000 FCFA' },
      { imageUrl: 'https://images.unsplash.com/photo-1602836924345-7f9da5661eb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Barcelone', name: 'Barcelone', details: '18 juin - 25 juin • 7 jours', price: '300 000 FCFA' },
      { imageUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Toulouse', name: 'Toulouse', details: '11 sept. - 18 sept. • 7 jours', price: '840 000 FCFA' },
      { imageUrl: 'https://images.unsplash.com/photo-1445112098124-3e76dd67983c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Marrakech', name: 'Marrakech', details: '20 janv. - 30 janv. • 10 jours', price: '760 000 FCFA' }
    ];
  }

  populateCheapFlightsFrance(): void {
    this.cheapFlightsFrance = [
      { imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Paris', name: 'Paris', details: '10 janv. - 17 janv. • 7 jours', price: '559 000 FCFA', link: '/vols/paris' },
      { imageUrl: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Nice', name: 'Nice', details: '6 août - 13 août • 7 jours', price: '640 000 FCFA', link: '/vols/nice' },
      { imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Ajaccio', name: 'Ajaccio', details: '17 oct. - 20 oct. • 3 jours', price: '145 000 FCFA', link: '/vols/ajaccio' },
      { imageUrl: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', altText: 'Bordeaux', name: 'Bordeaux', details: '5 déc. - 10 déc. • 5 jours', price: '118 000 FCFA', link: '/vols/bordeaux' }
    ];
  }

  toggleFaq(item: { question: string, answer: string, isOpen?: boolean }): void {
    item.isOpen = !item.isOpen;
  }
}
