import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home';
import { LoginPageComponent } from './pages/login/login';
import { RegisterPageComponent } from './pages/register/register';
import { AdminDashboardPageComponent } from './pages/admin-dashboard/admin-dashboard';
import { ClientDashboardPageComponent } from './pages/client-dashboard/client-dashboard';

export const routes: Routes = [
    { path: '', component: HomePageComponent, pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent },
    { path: 'inscription', component: RegisterPageComponent },
    { path: 'admin', component: AdminDashboardPageComponent }, // Children routes for admin sections can be added later
    { path: 'client', component: ClientDashboardPageComponent }, // Children routes for client sections can be added later
    // Add a wildcard route for 404 eventually
    // { path: '**', component: PageNotFoundComponent },
];
