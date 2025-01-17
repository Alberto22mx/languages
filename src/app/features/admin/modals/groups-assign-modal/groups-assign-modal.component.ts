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
    private gamesService: GamesService
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.getGroups();
    this.getUsersTeachers();
    this.getUsersStudent();
    this.getLessons();
    this.getGames();
    this.getExams();
  }

  getGroups() {
    this.groupsService.getGroup(this.id).subscribe((response: any) => {
      this.assignedUsersTeacher = response.users;
      this.assignedUsers = response.users;
      this.assignedLessons = response.lessons;
      this.assignedGames = response.games;
      this.assignedExams = response.exams;
    });
  }

  // Usuarios Maestros
  getUsersTeachers() {
    this.usersService.getActiveUsersByType(UserType.TEACHER).subscribe((response: any) => {
      console.log("Maestros", response);
      this.unassignedUsersTeacher = this.transformUsersToAssignableItems(response);
    });
  }
  // Usuarios Estudiantes
  getUsersStudent() {
    this.usersService.getActiveUsersByType(UserType.STUDENT).subscribe((response: any) => {
      console.log("Estudiantes", response);
      this.unassignedUsers = this.transformUsersToAssignableItems(response);
    });
  }
  // Lecciones
  getLessons() {
    this.lessonsService.findAll().subscribe((response: any) => {
      console.log("Lecciones", response);
      this.unassignedLessons = this.transformUsersToAssignableItems(response);
    });
  }
  // Juegos
  getGames() {
    this.gamesService.findAll().subscribe((response: any) => {
      console.log("Juegos", response);
      this.unassignedGames = this.transformUsersToAssignableItems(response);
    });
  }
  // Exámenes
  getExams() {
    this.examsService.findAll().subscribe((response: any) => {
      console.log("Exámenes", response);
      this.unassignedExams = this.transformUsersToAssignableItems(response);
    });
  }

  saveGroup() {
    const updatedGroup = {
      users: this.assignedUsers.map(user => user.id), // Solo los IDs
      lessons: this.assignedLessons.map(lesson => lesson.id),
      games: this.assignedGames.map(game => game.id),
      exams: this.assignedExams.map(exam => exam.id),
    };

    console.log('Datos a guardar:', updatedGroup);

    // Envía los datos al backend
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close();
    const updatedGroup = {
      users: this.assignedUsers.map((user) => user.id),
      usersTeachers: this.assignedUsersTeacher.map((user) => user.id),
      lessons: this.assignedLessons.map((lesson) => lesson.id),
      games: this.assignedGames.map((game) => game.id),
      exams: this.assignedExams.map((exam) => exam.id),
    };
    console.log('Datos a guardar:', updatedGroup);
    // if (this.userForm.valid) {
    //   // Lógica para enviar el formulario
    //   console.log(this.userForm.value);
    //   this.usersService.createUser(this.userForm.value).subscribe();
      
    // }
  }

  transformUsersToAssignableItems(users: any[]): AssignableItem[] {
    console.log("users", users);
    return users.map(user => ({
      id: user.id || '', // Usar el ID o un valor vacío si no existe
      name: `${user.firstName || ''} ${user.lastNameFather || ''} ${user.lastNameMother || ''}`.trim(), // Construir el nombre completo
      registrationNumber: user.registrationNumber || '' // Usar el número de registro o un valor vacío si no existe
    }));
  }

  // Maneja la actualización de la lista asignada
  onUpdateAssigned(updatedItems: AssignableItem[]) {
    this.assignedUsersTeacher = updatedItems;
    console.log('Lista asignada actualizada:', this.assignedUsersTeacher);
  }

  isDataAvailable(assigned: AssignableItem[], unassigned: AssignableItem[]): boolean {
    return (assigned && assigned.length > 0) || (unassigned && unassigned.length > 0);
  }
  
}
