import { Routes } from '@angular/router';
import { ForeverComponent } from './layouts/forever/forever.component';
import { LoginComponent } from './account/auth/login/login.component';
import { LessonsComponent } from './features/user/lessons/lessons.component';
import { DashboardComponent } from './features/user/dashboard/dashboard.component';
import { AboutComponent } from './features/user/about/about.component';
import { GamesComponent } from './features/user/games/games.component';
import { ProgressComponent } from './features/user/progress/progress.component';
import { AbcComponent } from './features/user/games/components/abc/abc.component';
import { loginGuard } from './shared/guard/login.guard';
import { authGuard } from './shared/guard/auth.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { roleGuard } from './shared/guard/role.guard';
import { AdminExamComponent } from './features/admin/admin-exam/admin-exam.component';
import { AdminGamesComponent } from './features/admin/admin-games/admin-games.component';
import { AdminGroupsComponent } from './features/admin/admin-groups/admin-groups.component';
import { AdminLessonsComponent } from './features/admin/admin-lessons/admin-lessons.component';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users.component';
import { AdminProgressComponent } from './features/admin/admin-progress/admin-progress.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { TeacherExamComponent } from './features/teacher/teacher-exam/teacher-exam.component';
import { TeacherGroupsComponent } from './features/teacher/teacher-groups/teacher-groups.component';
import { TeacherProgressComponent } from './features/teacher/teacher-progress/teacher-progress.component';
import { TeacherUsersComponent } from './features/teacher/teacher-users/teacher-users.component';
import { ExamComponent } from './features/user/exam/exam.component';
import { TeacherGamesComponent } from './features/teacher/teacher-games/teacher-games.component';
import { TeacherLessonsComponent } from './features/teacher/teacher-lessons/teacher-lessons.component';
import { LessonsContentComponent } from './features/teacher/teacher-lessons/lessons-content/lessons-content.component';
import { UserLessonsContentComponent } from './features/user/lessons/user-lessons-content/user-lessons-content.component';
import { VirtualTutorComponent } from './features/user/virtual-tutor/virtual-tutor.component';
import { UserExamComponent } from './features/user/exam/user-exam/user-exam.component';
import { ExamContentComponent } from './features/teacher/teacher-exam/exam-content/exam-content.component';
import { GamesScenaComponent } from './features/user/games/components/games-scena/games-scena.component';
import { TomGameComponent } from './features/user/games/components/tom-game/tom-game.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard]
    },
    {path: 'about', component: AboutComponent},
    {
        path: 'modulos', component: ForeverComponent, children: [
          {
            path: 'i', children: [
              { path: 'dashboard', component: DashboardComponent },
              { path: 'lessons', component: LessonsComponent },
              { path: 'lessons-content', component: UserLessonsContentComponent },
              { path: 'games', component: GamesComponent},
              { path: 'games-content', children: [
                { path: 'abc', component: AbcComponent },
                { path: 'plantilla', component: GamesScenaComponent },
                { path: 'tom', component: TomGameComponent }
              ] },
              { path: 'progress', component: ProgressComponent },
              { path: 'exam', component: ExamComponent },
              { path: 'exam-content', component: UserExamComponent },
              { path: 'profil', component: ProfileComponent },
              { path: 'virtual', component: VirtualTutorComponent },
            ],
            canActivate: [authGuard, roleGuard(['student'])]
          },
          {
            path: 'ii', children: [
              { path: 'dashboard', component: DashboardComponent },
              { path: 'teacher-lessons', component: TeacherLessonsComponent },
              { path: 'teacher-lessons-content', component: LessonsContentComponent },
              { path: 'teacher-games', component: TeacherGamesComponent },
              { path: 'teacher-groups', component: TeacherGroupsComponent },
              { path: 'teacher-users', component: TeacherUsersComponent },
              { path: 'teacher-progress', component: TeacherProgressComponent },
              { path: 'teacher-exam', component: TeacherExamComponent },
              { path: 'teacher-exam-content', component: ExamContentComponent },
              { path: 'profil', component: ProfileComponent },
            ],
            canActivate: [authGuard, roleGuard(['teacher'])]
          },
          {
            path: 'iii', children: [
              { path: 'dashboard', component: DashboardComponent },
              { path: 'admin-users', component: AdminUsersComponent },
              { path: 'admin-lessons', component: AdminLessonsComponent },
              { path: 'admin-games', component: AdminGamesComponent },
              { path: 'admin-progress', component: AdminProgressComponent },
              { path: 'admin-exam', component: AdminExamComponent },
              { path: 'admin-groups', component: AdminGroupsComponent },
              { path: 'profil', component: ProfileComponent },
            ],
            canActivate: [authGuard, roleGuard(['admin'])]
          }
        ]
      },
    { path: '**', component: PageNotFoundComponent },
];
