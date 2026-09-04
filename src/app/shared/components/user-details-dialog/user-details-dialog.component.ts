import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Group } from '../../../core/interfaces/groups.interface';
import { User } from '../../../core/interfaces/user.interface';
import { GroupsService } from '../../../core/services/groups/groups.service';

@Component({
    selector: 'app-user-details-dialog',
    imports: [
        CommonModule,
        DatePipe,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './user-details-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './user-details-dialog.component.css'
})
export class UserDetailsDialogComponent implements OnInit {
  groups: Group[] = [];
  loadingGroups = false;
  groupsError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly user: User,
    private readonly groupsService: GroupsService,
  ) {}

  ngOnInit(): void {
    if (!this.user.id || !this.isGroupMember()) return;

    this.loadingGroups = true;
    this.groupsService.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups.filter((group) => group.users?.includes(this.user.id!));
        this.loadingGroups = false;
      },
      error: () => {
        this.groupsError = true;
        this.loadingGroups = false;
      },
    });
  }

  get fullName(): string {
    return [this.user.firstName, this.user.lastNameFather, this.user.lastNameMother]
      .filter(Boolean)
      .join(' ');
  }

  get roleLabel(): string {
    return (
      {
        admin: 'Administrador',
        student: 'Alumno',
        teacher: 'Maestro',
      }[this.user.userType ?? ''] ?? this.user.userType ?? 'Sin definir'
    );
  }

  get groupsTitle(): string {
    return this.user.userType === 'teacher'
      ? 'Grupos a su cargo'
      : 'Grupos del alumno';
  }

  isGroupMember(): boolean {
    return this.user.userType === 'student' || this.user.userType === 'teacher';
  }
}
