import { Component, inject, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Lessons } from '../../../core/interfaces/lessons.interface';
import { LessonsService } from '../../../core/services/lessons/lessons.service';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { LessonsModalComponent } from '../../admin/modals/lessons-modal/lessons-modal.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-teacher-lessons',
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatMenuModule, MatIconModule],
    templateUrl: './teacher-lessons.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './teacher-lessons.component.css'
})
export class TeacherLessonsComponent implements OnInit {
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
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getLessons();
  }

  getLessons() {
    this.lessonsService.findForTeacher().subscribe({
      next: (response) => {
        this.lessons = response;
        this.totalUsers = response.length;
        this.dataSource = new MatTableDataSource(this.lessons);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.lessons = [];
        this.totalUsers = 0;
        this.dataSource = new MatTableDataSource<Lessons>([]);
        this.alertsService.warning('No fue posible cargar las lecciones del grupo.');
      },
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
    this.getLessons();
  }

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.dialog.open(LessonsModalComponent, {
      width: '700px',
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

  goBack(): void {
    this.location.back(); // Regresa a la página anterior
  }

  openEdit(lessons: any): void {
    this.router.navigate(['/modulos/ii/teacher-lessons-content'], {
      state: { ...lessons },
    });
  }
}
