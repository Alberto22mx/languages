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
import { GamesService } from '../../../../core/services/games/games.service';

@Component({
  selector: 'app-games-modal',
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
  templateUrl: './games-modal.component.html',
  styleUrl: './games-modal.component.css'
})
export class GamesModalComponent implements OnInit {
  groupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GamesModalComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: User,
    private gamesService: GamesService,
  ) {
    this.groupForm = this.fb.group({
      title: ['', Validators.required],
      instructions: ['', Validators.required],
      image: [''],
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      // Lógica para enviar el formulario
      this.gamesService.create(this.groupForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close({ status: 'success', data: response });
        },
        error: (error) => {
          this.dialogRef.close({ status: 'error', message: error.message });
        },
      });
    }
  }

}
