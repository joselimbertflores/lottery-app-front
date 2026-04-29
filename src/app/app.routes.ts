import { Routes } from '@angular/router';
import { SetupComponent } from './presentation/pages/setup/setup.component';
import { HomeComponent } from './presentation/pages/home/home.component';
import { PrizesComponent } from './presentation/pages/prizes/prizes.component';
import { ParticipantsComponent } from './presentation/pages/participants/participants.component';
import { WinnersComponent } from './presentation/pages/winners/winners.component';
import { LandingComponent } from './presentation/pages/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'Presentancion',
  },
  {
    path: 'main',
    component: SetupComponent,
    title: 'Inicio - Sorteo',
  },
  {
    path: 'upload',
    loadComponent: () => import('./pages/data-upload-page/data-upload-page'),
    title: 'Carga de Datos',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Menu',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'participants' },
      { path: 'participants', component: ParticipantsComponent },
      { path: 'prizes', component: PrizesComponent },
      { path: 'winners', component: WinnersComponent },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
