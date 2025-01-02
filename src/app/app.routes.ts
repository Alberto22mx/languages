import { Routes } from '@angular/router';
import { ForeverComponent } from './layouts/forever/forever.component';
import { LoginComponent } from './account/auth/login/login.component';
import { LessonsComponent } from './features/lessons/lessons.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AboutComponent } from './features/about/about.component';
import { GamesComponent } from './features/games/games.component';
import { ProgressComponent } from './features/progress/progress.component';
import { VocabularyComponent } from './features/vocabulary/vocabulary.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    
    {path: 'login', component: LoginComponent},
    {path: 'about', component: AboutComponent},
    {path: 'modulos', component: ForeverComponent, children: [ 
        { path: 'dashboard', component: DashboardComponent }, 
        { path: 'lessons', component: LessonsComponent},
        { path: 'games', component: GamesComponent},
        { path: 'progres', component: ProgressComponent},
        { path: 'vocabulary', component: VocabularyComponent},
        { path: 'progres', component: ProgressComponent},
        { path: 'settings', component: SettingsComponent},
    ]}
];
