
import { Component, inject, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Lessons } from '../../../core/interfaces/lessons.interface';
import { Group } from '../../../core/interfaces/groups.interface';
import { LessonsService } from '../../../core/services/lessons/lessons.service';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { LessonsModalComponent } from '../../admin/modals/lessons-modal/lessons-modal.component';
import { ExamsService } from '../../../core/services/exams/exams.service';
import { Exams } from '../../../core/interfaces/exams.interface';

@Component({
    selector: 'app-teacher-exam',
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule],
    templateUrl: './teacher-exam.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './teacher-exam.component.css'
})
export class TeacherExamComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  lessons: Lessons[] = [];
  exams: Exams[] = [];
  data!: Group;
  totalUsers = 0;
  pageSize = 10;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['title', 'instructions', 'actions'];
  dataSource!: MatTableDataSource<Exams>;

  constructor(
    private examsService: ExamsService,
    private lessonsService: LessonsService,
    private alertsService: AlertsService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.data = history.state;
    if (!this.data?.id) {
      this.router.navigate(['/modulos/ii/teacher-groups']);
      return;
    }
    this.getLessons();
  }

  getLessons() {
    // if (this.data.lessons)
    // this.lessonsService.findByIds(this.data.lessons).subscribe((response: any) => {
    //   console.log(response);
    //   this.lessons = response;
    //   this.totalUsers = response.total;
    //   this.dataSource = new MatTableDataSource(this.lessons);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
    if (this.data.exams) {
    const examIds = this.data.exams.map((exam: any) => typeof exam === 'string' ? exam : exam.id);
    this.examsService.findByIds(examIds).subscribe(response => {
      this.exams = response;
      this.totalUsers = response.length;
      this.dataSource = new MatTableDataSource(this.exams);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    }
    
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
        next: (res) => {
          this.getLessons();
          this.alertsService.success('Elemento eliminado con éxito.');
        },
        error: (err) => {
          this.alertsService.warning('Eliminación cancelada.');
        },
      });
    }
  }

  goBack(): void {
    this.location.back(); // Regresa a la página anterior
  }

  openCreate(exam: any): void {
    this.router.navigate(['/modulos/ii/teacher-exam-content'], {
      state: { ...exam },
    });
  }

  openEdit(exam: any): void {
    this.router.navigate(['/modulos/ii/teacher-exam-content'], {
      state: { ...exam },
    });
  }

  openGrades(exam: any): void {
    this.router.navigate(['/modulos/ii/teacher-exam-grades'], {
      state: { group: this.data, exam },
    });
  }
}
