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
import { ExamsService } from '../../../../core/services/exams/exams.service';

@Component({
  selector: 'app-exam-modal',
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
  templateUrl: './exam-modal.component.html',
  styleUrl: './exam-modal.component.css'
})
export class ExamModalComponent implements OnInit {
  groupForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private examsService: ExamsService,
  ) { }

  ngOnInit(): void {
    // Determina si el modal es para editar o crear
    this.isEdit = !!this.data?.exam;

    // Inicializa el formulario
    this.groupForm = this.fb.group({
      title: [this.data?.exam?.title || '', Validators.required],
      instructions: [this.data?.exam?.instructions || '', Validators.required],
      image: [this.data?.exam?.image || ''],
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
        this.examsService.update(this.data.exam.id, this.groupForm.value).subscribe({
          next: (response) => {
            this.dialogRef.close({ status: 'success', data: response, action: 'edit' });
          },
          error: (error) => {
            this.dialogRef.close({ status: 'error', message: error.message });
          },
        });
      } else {
        // Enviar nuevos datos al componente padre
        this.examsService.create(this.groupForm.value).subscribe({
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
