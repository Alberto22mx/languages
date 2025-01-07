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
import { AbcComponent } from './features/games/components/abc/abc.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'about', component: AboutComponent},
    {path: 'modulos', component: ForeverComponent, children: [ 
        { path: 'dashboard', component: DashboardComponent }, 
        { path: 'lessons', component: LessonsComponent},
        { path: 'games', component: GamesComponent, children: [
            {path: 'abc', component: AbcComponent }
        ]},
        { path: 'progress', component: ProgressComponent},
        { path: 'vocabulary', component: VocabularyComponent},
        { path: 'exam', component: SettingsComponent},
        { path: 'settings', component: SettingsComponent},
    ]}
];
