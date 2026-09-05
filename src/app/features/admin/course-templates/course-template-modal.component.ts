import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { CourseTemplate } from '../../../core/interfaces/course-template.interface';
import { Exams } from '../../../core/interfaces/exams.interface';
import { Lessons } from '../../../core/interfaces/lessons.interface';
import { CourseTemplatesService } from '../../../core/services/course-templates/course-templates.service';
import { ExamsService } from '../../../core/services/exams/exams.service';
import { LessonsService } from '../../../core/services/lessons/lessons.service';
import { LevelGroup } from '../../../shared/enums/level-group';

interface CourseTemplateModalData {
  template?: CourseTemplate;
}

@Component({
  selector: 'app-course-template-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './course-template-modal.component.html',
  styleUrl: './course-template-modal.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CourseTemplateModalComponent implements OnInit {
  readonly levels = LevelGroup;
  readonly statuses = ['active', 'archived'] as const;
  lessons: Lessons[] = [];
  exams: Exams[] = [];
  isLoadingContent = true;
  readonly isEdit: boolean;

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    course: ['', [Validators.required, Validators.maxLength(120)]],
    level: ['', Validators.required],
    version: [1, [Validators.required, Validators.min(1)]],
    status: ['active', Validators.required],
    lessons: [[] as string[]],
    exams: [[] as string[]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<CourseTemplateModalComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: CourseTemplateModalData | null,
    private readonly courseTemplatesService: CourseTemplatesService,
    private readonly lessonsService: LessonsService,
    private readonly examsService: ExamsService,
  ) {
    this.isEdit = !!data?.template;
  }

  ngOnInit(): void {
    const template = this.data?.template;
    if (template) {
      this.form.patchValue({
        name: template.name,
        course: template.course,
        level: template.level,
        version: template.version,
        status: template.status,
        lessons: template.lessons,
        exams: template.exams,
      });
    }

    forkJoin({
      lessons: this.lessonsService.findAll(),
      exams: this.examsService.findAll(),
    }).subscribe({
      next: ({ lessons, exams }) => {
        this.lessons = lessons;
        this.exams = exams;
        this.isLoadingContent = false;
      },
      error: () => {
        this.isLoadingContent = false;
      },
    });
  }

  save(): void {
    if (this.form.invalid || this.isLoadingContent) {
      this.form.markAllAsTouched();
      return;
    }

    const template = this.form.getRawValue() as Omit<CourseTemplate, 'id'>;
    const request = this.isEdit
      ? this.courseTemplatesService.update(this.data!.template!.id, template)
      : this.courseTemplatesService.create(template);

    request.subscribe({
      next: (savedTemplate) => this.dialogRef.close({ status: 'success', template: savedTemplate }),
      error: (error) => this.dialogRef.close({ status: 'error', message: error.error?.message ?? 'No fue posible guardar la plantilla.' }),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
