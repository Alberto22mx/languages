import { Component, inject, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LessonsModalComponent } from '../modals/lessons-modal/lessons-modal.component';
import { LessonsService } from '../../../core/services/lessons/lessons.service';
import { Lessons } from '../../../core/interfaces/lessons.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AlertsService } from '../../../core/services/alerts/alerts.service';

@Component({
    selector: 'app-admin-lessons',
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatMenuModule, MatIconModule],
    templateUrl: './admin-lessons.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-lessons.component.css'
})
export class AdminLessonsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  lessons: Lessons[] = [];

  totalUsers = 0;
  pageSize = 10;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['title', 'instructions', 'actions'];
  dataSource!: MatTableDataSource<Lessons>;

  constructor(
    private lessonsService: LessonsService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.getLessons();
  }

  getLessons() {
    this.lessonsService.findAll().subscribe((response: any) => {
      this.lessons = response;
      this.totalUsers = response.length;
      this.dataSource = new MatTableDataSource(this.lessons);
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
  }

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(LessonsModalComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getLessons();
    });
  }

  openEditModal(lessons: any): void {
    const dialogRef = this.dialog.open(LessonsModalComponent, {
      width: '500px',
      data: { lessons }, // Pasamos los datos del juego a editar
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit') {
        this.getLessons();
      }
    });
  }

  async confirmDelete(id: string) {
    const confirmed = await this.alertsService.confirm(
      '¿Seguro que deseas eliminar este elemento?',
      'Confirmación de Eliminación'
    );
    if (confirmed) {
      this.lessonsService.delete(id).subscribe({
        next: () => {
          this.getLessons();
          this.alertsService.success('Elemento eliminado con éxito.');
        },
        error: () => {
          this.alertsService.warning('Eliminación cancelada.');
        },
      });
    }
  }
}
