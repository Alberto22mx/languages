import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { GamesModalComponent } from '../../admin/modals/games-modal/games-modal.component';
import { GroupsService } from '../../../core/services/groups/groups.service';
import { Router } from '@angular/router';
import { Group } from '../../../core/interfaces/groups.interface';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-teacher-groups',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule],
  templateUrl: './teacher-groups.component.html',
  styleUrl: './teacher-groups.component.css'
})
export class TeacherGroupsComponent implements OnInit {
readonly dialog = inject(MatDialog);
  group: Group[] = [];

  totalUsers = 0;
  pageSize = 10;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['course', 'name', 'level', 'schedule', 'state', 'actions'];
  dataSource!: MatTableDataSource<Group>;

  constructor(
    private alertsService: AlertsService,
    private groupsService: GroupsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getGames();
  }

  getGames() {
    const teacherId = this.authService.getUserId();
    if (!teacherId) {
      return;
    }
    this.groupsService.getGroupWithRelations(teacherId).subscribe((response: any) => {
      this.group = response;
      this.totalUsers = response.length;
      this.dataSource = new MatTableDataSource(this.group);
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
    this.getGames();
  }

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(GamesModalComponent, {
      width: '700px',
      data: null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        this.getGames();
      }
    });
  }

  openEdit(group: any): void {
    this.router.navigate(['/modulos/ii/teacher-lessons'], {
      state: { ...group },
    });
  }

  openEditExam(group: any): void {
    this.router.navigate(['/modulos/ii/teacher-exam'], {
      state: { ...group },
    });
  }

  async confirmDelete(id: string) {
    const confirmed = await this.alertsService.confirm(
      '¿Seguro que deseas eliminar este elemento?',
      'Confirmación de Eliminación'
    );
    if (confirmed) {
      this.groupsService.deleteGroup(id).subscribe({
        next: (res) => {
          this.getGames();
          this.alertsService.success('Elemento eliminado con éxito.');
        },
        error: (err) => {
          this.alertsService.warning('Eliminación cancelada.');
        },
      });
    }
  }
}
