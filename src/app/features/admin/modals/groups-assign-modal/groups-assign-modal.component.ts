import { Component, OnInit } from '@angular/core';
import { AssignComponent } from "./assign/assign.component";
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { AssignableItem } from '../../../../core/interfaces/assignable-item.interce';

@Component({
  selector: 'app-groups-assign-modal',
  standalone: true,
  imports: [AssignComponent, MatDialogModule, MatButtonModule, MatTabsModule],
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

  constructor(
    public dialogRef: MatDialogRef<GroupsAssignModalComponent>,
    private groupsService: GroupsService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    // this.assignedUsersTeacher = [
    //   {
    //     id: '41476d83-97ac-42ee-8ec2-b326cc4b2418',
    //     name: 'Jose Alberto Pérez García',
    //     registrationNumber: 'REG001'
    //   },
    //   {
    //     id: '',
    //     name: 'Jose Alberto Pérez García',
    //     registrationNumber: 'REG002'
    //   },
    //   {
    //     id: 'e0aa8526-422f-4c75-8c82-8feb37bea4e6',
    //     name: 'Jose Alberto Serrrano Serrano',
    //     registrationNumber: 'REG000002'
    //   }
    // ]
    this.unassignedUsersTeacher = [
      {
        id: '41476d83-97ac-42ee-8ec2-b326cc4b2418',
        name: 'Jose Alberto Pérez García',
        registrationNumber: 'REG001'
      },
      {
        id: '',
        name: 'Jose Alberto Pérez García',
        registrationNumber: 'REG002'
      },
      {
        id: 'e0aa8526-422f-4c75-8c82-8feb37bea4e6',
        name: 'Jose Alberto Serrrano Serrano',
        registrationNumber: 'REG000002'
      }
    ]
    this.getGroups();
    // this.getUsers();
  }

  getGroups() {
    this.groupsService.getGroup('79e96417-23d9-4c6b-9654-ae700cb23010').subscribe((response: any) => {
      this.assignedUsersTeacher = response.users;
    });
  }

  getUsers() {
    this.usersService.getUsers().subscribe((response: any) => {
      console.log(response);
      this.unassignedUsersTeacher = this.transformUsersToAssignableItems(response);
    });
  }

  // receiveMessage($event: string) {
  //   this.message = $event;
  // }

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
}
