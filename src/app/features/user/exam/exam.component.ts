import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { GroupsService } from '../../../core/services/groups/groups.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProgressService } from '../../../core/services/progress/progress.service';
import { AlertsService } from '../../../core/services/alerts/alerts.service';

interface StudentExamRow {
  id: string;
  title: string;
  instructions: string;
  group: string;
  enrollmentStatus?: 'in_progress' | 'completed' | 'withdrawn';
  access?: any;
}

@Component({
    selector: 'app-exam',
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    templateUrl: './exam.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './exam.component.css'
})
export class ExamComponent implements OnInit {
  displayedColumns = ['title', 'instructions', 'group', 'deadline', 'status', 'grade', 'actions'];
  dataSource = new MatTableDataSource<StudentExamRow>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly groupsService: GroupsService,
    private readonly authService: AuthService,
    private readonly progressService: ProgressService,
    private readonly alertsService: AlertsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const studentId = this.authService.getUserId();
    if (!studentId) return;
    this.groupsService.getGroupWithRelations(studentId).subscribe({
      next: (groups) => {
        const rows: StudentExamRow[] = groups.flatMap((group) => (group.exams ?? []).map((exam) => ({
          id: exam.id ?? '', title: exam.title ?? '', instructions: exam.instructions ?? '',
          group: `${group.nameGroup ?? ''} ${group.course ?? ''}`.trim(),
          enrollmentStatus: group.enrollmentStatus,
        }))).filter((exam) => !!exam.id);
        this.dataSource.data = rows;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        rows.forEach((row) => {
          if (row.enrollmentStatus && row.enrollmentStatus !== 'in_progress') {
            row.access = { canSubmit: false, historical: true };
          } else {
            this.loadAccess(row);
          }
        });
      },
      error: () => this.alertsService.warning('No fue posible cargar los exámenes.'),
    });
  }

  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  present(row: StudentExamRow): void {
    if (row.access?.canSubmit) this.router.navigate(['/modulos/i/exam-content'], { state: { id: row.id } });
  }

  requestNewAttempt(row: StudentExamRow): void {
    this.progressService.requestExamAccess(row.id).subscribe({
      next: () => { this.alertsService.success('Solicitud enviada a tu docente.'); this.loadAccess(row); },
      error: (error) => this.alertsService.warning(error.error?.message ?? 'No fue posible enviar la solicitud.'),
    });
  }

  status(row: StudentExamRow): string {
    if (!row.access) return 'Cargando…';
    if (row.access.historical) return row.enrollmentStatus === 'completed' ? 'Curso finalizado' : 'Baja del curso';
    if (row.access.deadlinePassed) return 'Fecha límite vencida';
    if (row.access.canSubmit && row.access.additionalAttemptExpiresAt) {
      return `Nueva oportunidad hasta ${new Date(row.access.additionalAttemptExpiresAt).toLocaleString()}`;
    }
    if (row.access.canSubmit) return `Disponible (${row.access.submissions}/${row.access.allowedAttempts})`;
    if (row.access.request?.status === 'pending') return 'Solicitud pendiente';
    if (row.access.request?.status === 'rejected') return 'Solicitud rechazada';
    return 'Intento agotado';
  }

  private loadAccess(row: StudentExamRow): void {
    this.progressService.getExamAccess(row.id).subscribe({
      next: (access) => { row.access = access; this.dataSource.data = [...this.dataSource.data]; },
    });
  }
}
