import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// Import HeaderComponent and FooterComponent if they are to be used globally here
// import { HeaderComponent } from './components/header/header.component';
// import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root', // Default selector
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // HeaderComponent, // Uncomment if used globally
    // FooterComponent  // Uncomment if used globally
  ],
  templateUrl: './app.html', // Path to the main app template
  styleUrls: ['./app.css']   // Path to the main app styles
})
export class AppComponent {
  title = 'mon-projet';
}
