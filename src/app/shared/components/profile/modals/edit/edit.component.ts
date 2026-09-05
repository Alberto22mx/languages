
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../../../core/interfaces/user.interface';
import { UsersService } from '../../../../../core/services/users/users.service';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';

@Component({
    selector: 'app-edit',
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
    templateUrl: './edit.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './edit.component.css'
})
export class EditComponent {
  userForm: FormGroup;
  userTypes: string[] = ['admin', 'student', 'teacher'];
  courses: string[] = ['Ingles', 'Chino'];
  isEditMode: boolean;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    private usersService: UsersService,
    private alertsService: AlertsService,
  ) {
    this.isEditMode = !!this.data; // Detectamos si estamos en modo edición
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastNameFather: ['', Validators.required],
      lastNameMother: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      userType: [{ value: '', disabled: this.isEditMode }, Validators.required], // Deshabilitado si es edición
    });

    if (this.isEditMode) {
      this.populateForm();
    }
  }

  // Llena el formulario con los datos del usuario en modo edición
  private populateForm(): void {
    this.userForm.patchValue({
      firstName: this.data?.firstName,
      lastNameFather: this.data?.lastNameFather,
      lastNameMother: this.data?.lastNameMother,
      phone: this.data?.phone,
      email: this.data?.email,
      birthDate: this.data?.birthDate,
      userType: this.data?.userType,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.isSaving) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.isEditMode
      ? { ...this.data, ...this.userForm.getRawValue() }
      : this.userForm.getRawValue();

    this.isSaving = true;
    if (this.isEditMode) {
      this.usersService.updateUser(formData.id!, formData).subscribe({
        next: (response) => this.closeAfterSave(response),
        error: (error) => this.handleSaveError(error),
      });
      return;
    }

    this.usersService.createUser(formData).subscribe({
      next: (response) => this.closeAfterSave(response),
      error: (error) => this.handleSaveError(error),
    });
  }

  private closeAfterSave(data: unknown): void {
    this.isSaving = false;
    this.dialogRef.close({ status: 'success', data });
  }

  private handleSaveError(error: { error?: { message?: string } }): void {
    this.isSaving = false;
    this.alertsService.warning(error.error?.message ?? 'No fue posible guardar el perfil.');
  }
}
