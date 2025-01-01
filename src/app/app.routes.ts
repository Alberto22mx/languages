import { Routes } from '@angular/router';
import { ForeverComponent } from './layouts/forever/forever.component';
import { LoginComponent } from './account/auth/login/login.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'home', component: ForeverComponent},
    {path: 'login', component: LoginComponent},
];
