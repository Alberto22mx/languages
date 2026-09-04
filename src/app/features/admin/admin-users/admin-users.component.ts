import { Component, AfterViewInit, ViewChild, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../../../core/interfaces/user.interface';
import { UsersService } from '../../../core/services/users/users.service';
import { UserModalComponent } from '../modals/user-modal/user-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { UserDetailsDialogComponent } from '../../../shared/components/user-details-dialog/user-details-dialog.component';

@Component({
    selector: 'app-admin-users',
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatMenuModule
    ],
    templateUrl: './admin-users.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  readonly protectedAdminRegistration = 'ADM000001';
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
    private authService: AuthService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsersPaginated(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.users = response.data;
      this.totalUsers = response.total;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });  
  }

  openEditModal(data: any): void {
      const dialogRef = this.dialog.open(UserModalComponent, {
        width: '500px',
        data, // Pasamos los datos del juego a editar
      });
  
      dialogRef.afterClosed().subscribe((result) => {
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

  async toggleUserState(user: User) {
    if (!user.id) {
      this.alertsService.warning('El usuario no tiene un identificador válido.');
      return;
    }
    if (user.registrationNumber === this.protectedAdminRegistration) {
      this.alertsService.warning('El administrador ADM000001 debe permanecer activo.');
      return;
    }

    const nextState = user.state === 'active' ? 'inactive' : 'active';
    const action = nextState === 'active' ? 'habilitar' : 'deshabilitar';
    const confirmed = await this.alertsService.confirm(
      `¿Seguro que deseas ${action} a ${user.registrationNumber}?`,
      'Confirmar cambio de estado'
    );
    if (!confirmed) return;

    this.usersService.updateUser(user.id, { state: nextState }).subscribe({
      next: () => {
        this.getUsers();
        this.alertsService.success(`Usuario ${action === 'habilitar' ? 'habilitado' : 'deshabilitado'} con éxito.`);
      },
      error: () => this.alertsService.warning('No fue posible cambiar el estado del usuario.'),
    });
  }
  
    async confirmDelete(id: string) {
      const confirmed = await this.alertsService.confirm(
        '¿Seguro que deseas eliminar este elemento?',
        'Confirmación de Eliminación'
      );
      if (confirmed) {
        this.usersService.deleteUser(id).subscribe({
          next: (res) => {
            this.getUsers();
            this.alertsService.success('Elemento eliminado con éxito.');
          },
          error: (err) => {
            this.alertsService.warning('Eliminación cancelada.');
          },
        });
      }
    }
}
