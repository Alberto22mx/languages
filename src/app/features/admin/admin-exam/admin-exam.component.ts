import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ExamModalComponent } from '../modals/exam-modal/exam-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ExamsService } from '../../../core/services/exams/exams.service';
import { Exams } from '../../../core/interfaces/exams.interface';
import { AlertsService } from '../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-admin-exam',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './admin-exam.component.html',
  styleUrl: './admin-exam.component.css'
})
export class AdminExamComponent {
  readonly dialog = inject(MatDialog);
  exams: Exams[] = [];

  totalUsers = 0;
  pageSize = 10;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['title', 'instructions', 'actions'];
  dataSource!: MatTableDataSource<Exams>;

  constructor(
    private examsService: ExamsService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.getExams();
  }

  getExams() {
    this.examsService.findAll().subscribe((response: any) => {
      this.exams = response;
      this.totalUsers = response.total;
      this.dataSource = new MatTableDataSource(this.exams);
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
    this.getExams();
  }

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(ExamModalComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        this.getExams();
      }
    });
  }

  openEditModal(exam: any): void {
      const dialogRef = this.dialog.open(ExamModalComponent, {
        width: '500px',
        data: { exam }, // Pasamos los datos del juego a editar
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.action === 'edit') {
          this.getExams();
        }
      });
    }

  async confirmDelete(id: string) {
    const confirmed = await this.alertsService.confirm(
      '¿Seguro que deseas eliminar este elemento?',
      'Confirmación de Eliminación'
    );
    if (confirmed) {
      this.examsService.delete(id).subscribe({
        next: (res) => {
          this.getExams();
          this.alertsService.success('Elemento eliminado con éxito.');
        },
        error: (err) => {
          this.alertsService.warning('Eliminación cancelada.');
        },
      });
    }
  }
}
