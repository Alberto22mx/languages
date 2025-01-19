import { Component, Inject, OnInit } from '@angular/core';
import { AssignComponent } from "./assign/assign.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { AssignableItem } from '../../../../core/interfaces/assignable-item.interce';
import { CommonModule } from '@angular/common';
import { UserType } from '../../../../core/interfaces/user.interface';
import { ExamsService } from '../../../../core/services/exams/exams.service';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { GamesService } from '../../../../core/services/games/games.service';
import { forkJoin, map } from 'rxjs';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-groups-assign-modal',
  standalone: true,
  imports: [CommonModule, AssignComponent, MatDialogModule, MatButtonModule, MatTabsModule],
  templateUrl: './groups-assign-modal.component.html',
  styleUrl: './groups-assign-modal.component.css',
})
export class GroupsAssignModalComponent implements OnInit {
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
    private alertsService: AlertsService,
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.initializeData();
  }
  
  initializeData() {
    this.getGroups().subscribe((groupData) => {
      console.log(groupData);
      forkJoin({
        teachers: this.getUsersTeachers(),
        students: this.getUsersStudent(),
        lessons: this.getLessons(),
        games: this.getGames(),
        exams: this.getExams(),
      }).subscribe(({ teachers, students, lessons, games, exams }) => {
        // Aplicar el filtrado con los datos transformados
        this.unassignedUsersTeacher = this.filterUnassignedItems(teachers, groupData.users);
        this.unassignedUsers = this.filterUnassignedItems(students, groupData.users);
        this.unassignedLessons = this.filterUnassignedItems(lessons, groupData.lessons);
        this.unassignedGames = this.filterUnassignedItems(games, groupData.games);
        this.unassignedExams = this.filterUnassignedItems(exams, groupData.exams);
      });
    });
  }
  
  getGroups() {
    return this.groupsService.getGroup(this.id).pipe(
      map((response: any) => {
        const assignedTeachers = response.users.filter((user: any) => user.type === UserType.TEACHER);
        const assignedStudents = response.users.filter((user: any) => user.type === UserType.STUDENT);

        // Asignar datos del grupo
        this.assignedUsersTeacher = assignedTeachers;
        this.assignedUsers = assignedStudents;
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
  filterUnassignedItems(items: AssignableItem[], assignedItems: AssignableItem[]): AssignableItem[] {
    return items.filter(item => !assignedItems.some(assigned => assigned.id === item.id));
  }

  onCancel(): void {
    this.dialogRef.close();
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
      next: (res) => {
        this.dialogRef.close({ status: 'success' });
      },
      error: (err) => {
        this.dialogRef.close({ status: 'error' });
      },
    });
    
  }

  transformUsersToAssignableItems(users: any[]): AssignableItem[] {
    return users.map(user => ({
      id: user.id || '', // Usar el ID o un valor vacío si no existe
      name: `${user.firstName || ''} ${user.lastNameFather || ''} ${user.lastNameMother || ''}`.trim(), // Construir el nombre completo
      registrationNumber: user.registrationNumber || '' // Usar el número de registro o un valor vacío si no existe
    }));
  }

  transformDataToAssignableItems(data: any[]): AssignableItem[] {
    return data.map(item => ({
      id: item.id || '', // Usar el ID o un valor vacío si no existe
      title: item.title || '', // Usar el título o un valor vacío si no existe
      name: '', // Campo vacío porque no aplica en este caso
      registrationNumber: '' // Campo vacío porque no aplica en este caso
    }));
  }
  
  // Maneja la actualización de la lista asignada
  onUpdateAssigned(updatedItems: AssignableItem[]) {
    this.assignedUsersTeacher = updatedItems;
  }

  isDataAvailable(assigned: AssignableItem[], unassigned: AssignableItem[]): boolean {
    return (assigned && assigned.length > 0) || (unassigned && unassigned.length > 0);
  }
  
}
