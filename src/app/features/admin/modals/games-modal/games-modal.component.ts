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

import { GamesService } from '../../../../core/services/games/games.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';

@Component({
    selector: 'app-games-modal',
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
    templateUrl: './games-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './games-modal.component.css'
})
export class GamesModalComponent implements OnInit {
  groupForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GamesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gamesService: GamesService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit(): void {
    // Determina si el modal es para editar o crear
    this.isEdit = !!this.data?.game;

    // Inicializa el formulario
    this.groupForm = this.fb.group({
      title: [this.data?.game?.title || '', Validators.required],
      instructions: [this.data?.game?.instructions || '', Validators.required],
      image: [this.data?.game?.image || ''],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      // Lógica para enviar el formulario
      if (this.isEdit) {
        // Enviar datos actualizados al componente padre
        this.gamesService.update(this.data.game.id, this.groupForm.value).subscribe({
          next: (response) => {
            this.dialogRef.close({ status: 'success', data: response, action: 'edit' });
          },
          error: (error) => {
            this.alertsService.warning(error.error?.message ?? 'No fue posible guardar el juego.');
          },
        });
      } else {
        // Enviar nuevos datos al componente padre
        this.gamesService.create(this.groupForm.value).subscribe({
          next: (response) => {
            this.dialogRef.close({ status: 'success', data: response, action: 'create' });
          },
          error: (error) => {
            this.alertsService.warning(error.error?.message ?? 'No fue posible crear el juego.');
          },
        });
      }
    }
  }

}
