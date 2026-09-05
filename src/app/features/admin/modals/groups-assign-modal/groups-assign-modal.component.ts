import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AssignComponent } from "./assign/assign.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { AssignableItem } from '../../../../core/interfaces/assignable-item.interce';

import { UserType } from '../../../../core/interfaces/user.interface';
import { CourseTemplatesService } from '../../../../core/services/course-templates/course-templates.service';
import { forkJoin, map } from 'rxjs';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';

@Component({
    selector: 'app-groups-assign-modal',
    imports: [AssignComponent, MatDialogModule, MatButtonModule, MatTabsModule],
    templateUrl: './groups-assign-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './groups-assign-modal.component.css'
})
export class GroupsAssignModalComponent implements OnInit {
  selectedTabIndex: number = 0;
  assignedUsersTeacher: AssignableItem[] = [];
  unassignedUsersTeacher: AssignableItem[] = [];
  assignedUsers: AssignableItem[] = [];
  unassignedUsers: AssignableItem[] = [];
  assignedTemplates: AssignableItem[] = [];
  unassignedTemplates: AssignableItem[] = [];
  id: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GroupsAssignModalComponent>,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private courseTemplatesService: CourseTemplatesService,
    private alertsService: AlertsService,
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.initializeData();
  }
  
  initializeData() {
    this.getGroups().subscribe((groupData) => {
      forkJoin({
        teachers: this.getUsersTeachers(),
        students: this.getUsersStudent(),
        templates: this.getCourseTemplates(),
      }).subscribe(({ teachers, students, templates }) => {
        const assignedUserIds = new Set(groupData.users ?? []);
        this.assignedUsersTeacher = teachers.filter((teacher) =>
          assignedUserIds.has(teacher.id)
        );
        this.unassignedUsersTeacher = teachers.filter(
          (teacher) => !assignedUserIds.has(teacher.id)
        );
        this.assignedUsers = students.filter((student) =>
          assignedUserIds.has(student.id)
        );
        this.unassignedUsers = students.filter(
          (student) => !assignedUserIds.has(student.id)
        );

        const eligibleTemplates = templates.filter((template) =>
          (template.course === groupData.course && template.level === groupData.level && template.status === 'active') ||
          template.id === groupData.templateId,
        );
        this.assignedTemplates = eligibleTemplates.filter((template) => template.id === groupData.templateId);
        this.unassignedTemplates = eligibleTemplates.filter((template) => template.id !== groupData.templateId);
      });
    });
  }  
  
  getGroups() {
    return this.groupsService.getGroup(this.id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
  getUsersTeachers() {
    return this.usersService.getActiveUsersByType(UserType.TEACHER).pipe(
      map((response: any) => this.transformUsersToAssignableItems(response))
    );
  }
  
  getUsersStudent() {
    return this.usersService.getActiveUsersByType(UserType.STUDENT).pipe(
      map((response: any) => this.transformUsersToAssignableItems(response))
    );
  }
  
  getCourseTemplates() {
    return this.courseTemplatesService.findAll().pipe(
      map((templates) => templates.map((template) => ({
        id: template.id,
        title: `${template.name} · V${template.version}`,
        course: template.course,
        level: template.level,
        status: template.status,
      }))),
    );
  }

  onCancel(): void {
    this.dialogRef.close({ status: 'error' });
  }

  onSubmit(): void {
    const updatedGroup = {
      users: [
        ...this.assignedUsers.map((user) => user.id),
        ...this.assignedUsersTeacher.map((user) => user.id),
      ],
      templateId: this.assignedTemplates[0]?.id,
    };

    if (!updatedGroup.templateId) {
      this.alertsService.warning('Selecciona una plantilla activa para el grupo.');
      return;
    }
    
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
      id: user.id || '',
      name: `${user.firstName || ''} ${user.lastNameFather || ''} ${user.lastNameMother || ''}`.trim(),
      registrationNumber: user.registrationNumber || '',
      userType: user.userType || ''
    }));
  }

  updateTeachers(lists: { assigned: AssignableItem[]; unassigned: AssignableItem[] }): void {
    this.assignedUsersTeacher = lists.assigned;
    this.unassignedUsersTeacher = lists.unassigned;
  }

  updateStudents(lists: { assigned: AssignableItem[]; unassigned: AssignableItem[] }): void {
    this.assignedUsers = lists.assigned;
    this.unassignedUsers = lists.unassigned;
  }

  updateTemplates(lists: { assigned: AssignableItem[]; unassigned: AssignableItem[] }): void {
    this.assignedTemplates = lists.assigned;
    this.unassignedTemplates = lists.unassigned;
  }
  
}
