import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AssignComponent } from "./assign/assign.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { AssignableItem } from '../../../../core/interfaces/assignable-item.interce';

import { UserType } from '../../../../core/interfaces/user.interface';
import { ExamsService } from '../../../../core/services/exams/exams.service';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { GamesService } from '../../../../core/services/games/games.service';
import { forkJoin, map } from 'rxjs';

@Component({
    selector: 'app-groups-assign-modal',
    imports: [AssignComponent, MatDialogModule, MatButtonModule, MatTabsModule],
    templateUrl: './groups-assign-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './groups-assign-modal.component.css'
})
export class GroupsAssignModalComponent implements OnInit {
  selectedTabIndex: number = 0; // Siempre abre la primera pestaña
  // Usuarios Maestros
  assignedUsersTeacher: AssignableItem[] = [];
  unassignedUsersTeacher: AssignableItem[] = [];
  // Usuarios Alumnos
  assignedUsers: AssignableItem[] = [];
  unassignedUsers: AssignableItem[] = [];
  // Lecciones
  assignedLessons: AssignableItem[] = [];
  unassignedLessons: AssignableItem[] = [];
  // Juegos
  assignedGames: AssignableItem[] = [];
  unassignedGames: AssignableItem[] = [];
  // Exámenes
  assignedExams: AssignableItem[] = [];
  unassignedExams: AssignableItem[] = [];
  id: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GroupsAssignModalComponent>,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private examsService: ExamsService,
    private lessonsService: LessonsService,
    private gamesService: GamesService,
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.initializeData();
    this.resetTabIndex();
  }

  private resetTabIndex(): void {
    this.selectedTabIndex = 0; // Asegura que se abra en la primera pestaña
  }
  
  initializeData() {
    this.getGroups().subscribe((groupData) => {
      forkJoin({
        teachers: this.getUsersTeachers(),
        students: this.getUsersStudent(),
        lessons: this.getLessons(),
        games: this.getGames(),
        exams: this.getExams(),
      }).subscribe(({ teachers, students, lessons, games, exams }) => {
        // Usuarios asignados y no asignados
        this.assignedUsersTeacher = teachers.filter((teacher) =>
          groupData.users.includes(teacher.id)
        );
        this.unassignedUsersTeacher = teachers.filter(
          (teacher) => !groupData.users.includes(teacher.id)
        );
  
        this.assignedUsers = students.filter((student) =>
          groupData.users.includes(student.id)
        );
        this.unassignedUsers = students.filter(
          (student) => !groupData.users.includes(student.id)
        );
  
        // Lecciones
        this.assignedLessons = lessons.filter((lesson) =>
          groupData.lessons.includes(lesson.id)
        );
        this.unassignedLessons = lessons.filter(
          (lesson) => !groupData.lessons.includes(lesson.id)
        );
  
        // Juegos
        this.assignedGames = games.filter((game) =>
          groupData.games.includes(game.id)
        );
        this.unassignedGames = games.filter(
          (game) => !groupData.games.includes(game.id)
        );
  
        // Exámenes
        this.assignedExams = exams.filter((exam) =>
          groupData.exams.includes(exam.id)
        );
        this.unassignedExams = exams.filter(
          (exam) => !groupData.exams.includes(exam.id)
        );
      });
    });
  }  
  
  getGroups() {
    return this.groupsService.getGroup(this.id).pipe(
      map((response: any) => {
        this.assignedLessons = response.lessons;
        this.assignedGames = response.games;
        this.assignedExams = response.exams;
        return response; // Retornar para el siguiente paso
      })
    );
  }
  
  // Usuarios Maestros
  getUsersTeachers() {
    return this.usersService.getActiveUsersByType(UserType.TEACHER).pipe(
      map((response: any) => this.transformUsersToAssignableItems(response))
    );
  }
  
  // Usuarios Estudiantes
  getUsersStudent() {
    return this.usersService.getActiveUsersByType(UserType.STUDENT).pipe(
      map((response: any) => this.transformUsersToAssignableItems(response))
    );
  }
  
  // Lecciones
  getLessons() {
    return this.lessonsService.findAll().pipe(
      map((response: any) => this.transformDataToAssignableItems(response))
    );
  }
  
  // Juegos
  getGames() {
    return this.gamesService.findAll().pipe(
      map((response: any) => this.transformDataToAssignableItems(response))
    );
  }
  
  // Exámenes
  getExams() {
    return this.examsService.findAll().pipe(
      map((response: any) => this.transformDataToAssignableItems(response))
    );
  }
  
  // Filtrar elementos no asignados
  filterUnassignedItems(items: AssignableItem[], assignedIds: string[]): AssignableItem[] {
    return items.filter(item => !assignedIds.includes(item.id));
  }  

  onCancel(): void {
    this.dialogRef.close({ status: 'error' });
  }

  onSubmit(): void {
    const updatedGroup = {
      users: [
        ...this.assignedUsers.map((user) => user.id), // Usuarios (students)
        ...this.assignedUsersTeacher.map((user) => user.id), // Usuarios (teachers)
      ],
      lessons: this.assignedLessons.map((lesson) => lesson.id),
      games: this.assignedGames.map((game) => game.id),
      exams: this.assignedExams.map((exam) => exam.id),
    };
    
    this.groupsService.updateGroup(this.id, updatedGroup).subscribe({
      next: () => {
        this.dialogRef.close({ status: 'success' });
      },
      error: () => {
        this.dialogRef.close({ status: 'error' });
      },
    });
    
  }

  transformUsersToAssignableItems(users: any[]): AssignableItem[] {
    return users.map(user => ({
      id: user.id || '', // Usar el ID o un valor vacío si no existe
      name: `${user.firstName || ''} ${user.lastNameFather || ''} ${user.lastNameMother || ''}`.trim(), // Construir el nombre completo
      registrationNumber: user.registrationNumber || '', // Usar el número de registro o un valor vacío si no existe
      userType: user.userType || ''
    }));
  }

  transformDataToAssignableItems(data: any[]): AssignableItem[] {
    return data.map(item => ({
      id: item.id || '', // Usar el ID o un valor vacío si no existe
      title: item.title || '', // Usar el título o un valor vacío si no existe
      name: '', // Campo vacío porque no aplica en este caso
      registrationNumber: '', // Campo vacío porque no aplica en este caso
      userType: ''
    }));
  }
  
  // Maneja la actualización de la lista asignada
  onUpdateAssigned(updatedItems: AssignableItem[]): void {
    // Actualiza la lista de asignados según la pestaña activa
    if (this.isCurrentTab('Maestro')) {
      this.assignedUsersTeacher = updatedItems;
      this.unassignedUsersTeacher = this.unassignedUsersTeacher.filter(
        (item) => !updatedItems.some((assigned) => assigned.id === item.id)
      );
    } else if (this.isCurrentTab('Alumnos')) {
      this.assignedUsers = updatedItems;
      this.unassignedUsers = this.unassignedUsers.filter(
        (item) => !updatedItems.some((assigned) => assigned.id === item.id)
      );
    } else if (this.isCurrentTab('Lecciones')) {
      this.assignedLessons = updatedItems;
      this.unassignedLessons = this.unassignedLessons.filter(
        (item) => !updatedItems.some((assigned) => assigned.id === item.id)
      );
    } else if (this.isCurrentTab('Juegos')) {
      this.assignedGames = updatedItems;
      this.unassignedGames = this.unassignedGames.filter(
        (item) => !updatedItems.some((assigned) => assigned.id === item.id)
      );
    } else if (this.isCurrentTab('Exámenes')) {
      this.assignedExams = updatedItems;
      this.unassignedExams = this.unassignedExams.filter(
        (item) => !updatedItems.some((assigned) => assigned.id === item.id)
      );
    }
  }

  isCurrentTab(tabName: string): boolean {
    const activeTab = document.querySelector('.mat-tab-label-active')?.textContent?.trim();
    return activeTab === tabName;
  }  

  isDataAvailable(assigned: AssignableItem[], unassigned: AssignableItem[]): boolean {
    return (assigned && assigned.length > 0) || (unassigned && unassigned.length > 0);
  }
  
}
