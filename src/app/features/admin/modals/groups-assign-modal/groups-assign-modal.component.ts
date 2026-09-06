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
import { forkJoin, map, switchMap } from 'rxjs';

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
  validationMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GroupsAssignModalComponent>,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private courseTemplatesService: CourseTemplatesService,
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.initializeData();
  }
  
  initializeData() {
    this.getGroups().pipe(
      switchMap((groupData) => forkJoin({
        teachers: this.getUsersTeachers(),
        students: this.getUsersStudent(),
        templates: this.getCourseTemplates(),
        activeStudentIds: this.groupsService.getActiveStudentIds(this.id),
      }).pipe(map(({ teachers, students, templates, activeStudentIds }) => ({
        groupData, teachers, students, templates, activeStudentIds,
      })))),
    ).subscribe(({ groupData, teachers, students, templates, activeStudentIds }) => {
        const assignedTeacherIds = new Set(groupData.teacherId ? [groupData.teacherId] : (groupData.users ?? []));
        this.assignedUsersTeacher = teachers.filter((teacher) =>
          assignedTeacherIds.has(teacher.id)
        );
        this.unassignedUsersTeacher = teachers.filter(
          (teacher) => !assignedTeacherIds.has(teacher.id)
        );
        const assignedStudentIds = new Set(activeStudentIds.length > 0 ? activeStudentIds : (groupData.users ?? []).filter((id: string) => !assignedTeacherIds.has(id)));
        this.assignedUsers = students.filter((student) =>
          assignedStudentIds.has(student.id)
        );
        this.unassignedUsers = students.filter(
          (student) => !assignedStudentIds.has(student.id)
        );

        const eligibleTemplates = templates.filter((template) =>
          (template.course === groupData.course && template.level === groupData.level) ||
          template.id === groupData.templateId,
        );
        this.assignedTemplates = eligibleTemplates.filter((template) => template.id === groupData.templateId);
        this.unassignedTemplates = eligibleTemplates.filter((template) => template.id !== groupData.templateId);
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
      teacherId: this.assignedUsersTeacher[0]?.id,
      studentIds: this.assignedUsers.map((user) => user.id),
      templateId: this.assignedTemplates[0]?.id,
    };

    if (!updatedGroup.templateId) {
      this.validationMessage = 'Selecciona una plantilla para el grupo.';
      this.selectedTabIndex = 2;
      return;
    }
    if (!updatedGroup.teacherId) {
      this.validationMessage = 'Asigna un profesor activo al grupo.';
      this.selectedTabIndex = 0;
      return;
    }
    
    this.groupsService.updateGroup(this.id, updatedGroup).subscribe({
      next: () => {
        this.dialogRef.close({ status: 'success' });
      },
      error: (error) => {
        this.validationMessage = error.error?.message ?? 'No fue posible guardar la configuración del grupo.';
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
    this.validationMessage = '';
    this.assignedUsersTeacher = lists.assigned;
    this.unassignedUsersTeacher = lists.unassigned;
  }

  updateStudents(lists: { assigned: AssignableItem[]; unassigned: AssignableItem[] }): void {
    this.validationMessage = '';
    this.assignedUsers = lists.assigned;
    this.unassignedUsers = lists.unassigned;
  }

  updateTemplates(lists: { assigned: AssignableItem[]; unassigned: AssignableItem[] }): void {
    this.validationMessage = '';
    this.assignedTemplates = lists.assigned;
    this.unassignedTemplates = lists.unassigned;
  }
  
}
