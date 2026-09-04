import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
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

import { LessonsService } from '../../../../core/services/lessons/lessons.service';

@Component({
    selector: 'app-lessons-modal',
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
    templateUrl: './lessons-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './lessons-modal.component.css'
})
export class LessonsModalComponent implements OnInit {
  groupForm!: FormGroup;
  isEdit: boolean = false;;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LessonsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lessonsService: LessonsService,
  ) {}

  ngOnInit() {
    // Determina si el modal es para editar o crear
    this.isEdit = !!this.data?.lessons;

    // Inicializa el formulario
    this.groupForm = this.fb.group({
      title: [this.data?.lessons?.title || '', Validators.required],
      instructions: [this.data?.lessons?.instructions || '', Validators.required],
      image: [this.data?.lessons?.image || ''],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      // Lógica para enviar el formulario
      const formData = this.groupForm.value;
      if (this.isEdit) {
        // Enviar datos actualizados al componente padre
        this.lessonsService.update(this.data.lessons.id, this.groupForm.value).subscribe({
          next: (response) => {
            this.dialogRef.close({ status: 'success', data: response, action: 'edit' });
          },
          error: (error) => {
            this.dialogRef.close({ status: 'error', message: error.message });
          },
        });
      } else {
        // Enviar nuevos datos al componente padre
        this.lessonsService.create(this.groupForm.value).subscribe({
          next: (response) => {
            this.dialogRef.close({ status: 'success', data: response, action: 'create' });
          },
          error: (error) => {
            this.dialogRef.close({ status: 'error', message: error.message });
          },
        });
      }
    }
  }
}
