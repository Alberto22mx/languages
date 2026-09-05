import { Component, ViewChild, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../../../core/interfaces/user.interface';
import { UsersService } from '../../../core/services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { UserModalComponent } from '../../admin/modals/user-modal/user-modal.component';
import { UserDetailsDialogComponent } from '../../../shared/components/user-details-dialog/user-details-dialog.component';
import { GroupsService } from '../../../core/services/groups/groups.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-teacher-users',
    templateUrl: './teacher-users.component.html',
    styleUrls: ['./teacher-users.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatMenuModule
    ]
})
export class TeacherUsersComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  users: User[] = [];

  totalUsers = 0;
  pageSize = 5;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['firstName', 'registrationNumber', 'userType', 'state', 'actions'];
  dataSource!: MatTableDataSource<User>;

  constructor(
    private usersService: UsersService,
    private alertsService: AlertsService,
    private groupsService: GroupsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.groupsService.getTeacherStudents().subscribe((response: any) => {
      this.users = response;
      this.totalUsers = response.length;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  reviewExams(user: User): void {
    this.router.navigate(['/modulos/ii/teacher-student-exams'], { state: { student: user } });
  }

  async completeStudent(user: User): Promise<void> {
    if (!user.id || !user.currentGroupId) return;
    const confirmed = await this.alertsService.confirm(
      `¿Finalizar el curso de ${user.firstName}? Esta acción conservará su historial.`,
      'Finalizar alumno',
    );
    if (!confirmed) return;
    this.groupsService.completeStudent(user.currentGroupId, user.id).subscribe({
      next: () => {
        this.alertsService.success('El alumno fue finalizado.');
        this.getUsers();
      },
      error: () => this.alertsService.warning('No fue posible finalizar al alumno.'),
    });
  }

  async withdrawStudent(user: User): Promise<void> {
    if (!user.id || !user.currentGroupId) return;
    const confirmed = await this.alertsService.confirm(
      `¿Dar de baja a ${user.firstName}? Podrá conservar su historial, pero dejará de estar en curso.`,
      'Dar de baja alumno',
    );
    if (!confirmed) return;
    this.groupsService.withdrawStudent(user.currentGroupId, user.id).subscribe({
      next: () => {
        this.alertsService.success('El alumno fue dado de baja.');
        this.getUsers();
      },
      error: () => this.alertsService.warning('No fue posible dar de baja al alumno.'),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '750px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });  
  }

  openEditModal(data: any): void {
      const dialogRef = this.dialog.open(UserModalComponent, {
        width: '500px',
        data, // Pasamos los datos del juego a editar
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.getUsers();
      });
    }

  openDetails(user: User): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: user,
    });
  }
  
    async confirmDelete(id: string) {
      const confirmed = await this.alertsService.confirm(
        '¿Seguro que deseas eliminar este elemento?',
        'Confirmación de Eliminación'
      );
      if (confirmed) {
        this.usersService.deleteUser(id).subscribe({
        next: () => {
            this.getUsers();
            this.alertsService.success('Elemento eliminado con éxito.');
          },
        error: () => {
            this.alertsService.warning('Eliminación cancelada.');
          },
        });
      }
    }
}
