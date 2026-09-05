import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

import { GroupsService } from '../../../../core/services/groups/groups.service';
import { CourseTemplatesService } from '../../../../core/services/course-templates/course-templates.service';
import { CourseTemplate } from '../../../../core/interfaces/course-template.interface';
import { LevelGroup } from '../../../../shared/enums/level-group';
import { ScheduleGroup } from '../../../../shared/enums/schedule-group';

@Component({
    selector: 'app-groups-modal',
    imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule
],
    templateUrl: './groups-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './groups-modal.component.css'
})
export class GroupsModalComponent implements OnInit {
  groupForm: FormGroup;
  levelGroup = LevelGroup;
  scheduleGroup = ScheduleGroup;
  courses: string[] = ['Ingles', 'Chino'];
  selectedDate: Date | null = null;
  isStudent = false;
  courseTemplates: CourseTemplate[] = [];
  isLoadingTemplates = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupsModalComponent>,
    private groupsService: GroupsService,
    private courseTemplatesService: CourseTemplatesService,
  ) {
    this.groupForm = this.fb.group({
      nameGroup: ['', Validators.required],
      course: ['', Validators.required],
      level: ['', Validators.required],
      description: ['', Validators.required],
      schedule: ['', Validators.required],
      templateId: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      // Lógica para enviar el formulario
      this.groupsService.createGroup(this.groupForm.getRawValue()).subscribe({
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
    this.courseTemplatesService.findAll().subscribe({
      next: (templates) => {
        this.courseTemplates = templates.filter((template) => template.status === 'active');
        this.isLoadingTemplates = false;
      },
      error: () => {
        this.courseTemplates = [];
        this.isLoadingTemplates = false;
      },
    });
  }

  onTemplateChange(templateId: string): void {
    const template = this.courseTemplates.find((item) => item.id === templateId);
    if (!template) return;

    const level = this.levelGroup.find((item) => item.level === template.level);
    this.groupForm.patchValue({
      course: template.course,
      level: template.level,
      description: level?.description ?? '',
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
