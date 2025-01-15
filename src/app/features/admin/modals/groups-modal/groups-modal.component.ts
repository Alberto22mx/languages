import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { LevelGroup } from '../../../../shared/enums/level-group';
import { ScheduleGroup } from '../../../../shared/enums/schedule-group';

@Component({
  selector: 'app-groups-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './groups-modal.component.html',
  styleUrl: './groups-modal.component.css',
})
export class GroupsModalComponent implements OnInit {
  groupForm: FormGroup;
  levelGroup = LevelGroup;
  scheduleGroup = ScheduleGroup;
  courses: string[] = ['Ingles', 'Chino'];
  selectedDate: Date | null = null;
  isStudent = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupsModalComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: User,
    private groupsService: GroupsService
  ) {
    this.groupForm = this.fb.group({
      nameGroup: ['', Validators.required],
      level: ['', Validators.required],
      description: ['', Validators.required],
      schedule: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      // Lógica para enviar el formulario
      console.log(this.groupForm.value);
      this.groupsService.createGroup(this.groupForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close({ status: 'success', data: response });
        },
        error: (error) => {
          this.dialogRef.close({ status: 'error', message: error.message });
        },
      });
    }
  }

  ngOnInit(): void {
    this.groupsService.getGroups().subscribe((results) => {
      console.log(results);
    });
  }

  onLevelChange(event: any) {
    const selectedLevel = event.value;
    const selectedLevelData = this.levelGroup.find(level => level.level === selectedLevel);
    if (selectedLevelData) {
      this.groupForm.patchValue({
        description: selectedLevelData.description
      });
    }
  }
}
