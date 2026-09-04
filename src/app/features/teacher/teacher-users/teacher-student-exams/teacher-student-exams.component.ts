import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { ProgressService } from '../../../../core/services/progress/progress.service';
import { TeacherExamGradeDialogComponent } from '../../teacher-exam/teacher-exam-grades/teacher-exam-grade-dialog.component';

@Component({
    selector: 'app-teacher-student-exams',
    imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule],
    templateUrl: './teacher-student-exams.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './teacher-student-exams.component.css'
})
export class TeacherStudentExamsComponent implements OnInit {
  student: any;
  results: any[] = [];
  displayedColumns = ['exam', 'submittedAt', 'score', 'actions'];

  constructor(
    private progressService: ProgressService,
    private alertsService: AlertsService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.student = history.state?.student;
    if (!this.student?.id) {
      this.router.navigate(['/modulos/ii/teacher-users']);
      return;
    }
    this.loadResults();
  }

  review(result: any): void {
    if (!result.submission) return;
    const dialogRef = this.dialog.open(TeacherExamGradeDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { exam: result.exam, result },
    });
    dialogRef.afterClosed().subscribe((evaluation) => {
      if (!evaluation) return;
      this.progressService.gradeExamSubmission(result.submission._id, evaluation.answers, evaluation.feedback).subscribe({
        next: () => {
          this.alertsService.success('Calificación guardada.');
          this.loadResults();
        },
        error: () => this.alertsService.warning('No fue posible guardar la calificación.'),
      });
    });
  }

  private loadResults(): void {
    this.progressService.getStudentExamResults(this.student.id).subscribe({
      next: (results) => this.results = results,
      error: () => this.alertsService.warning('No fue posible cargar los exámenes del alumno.'),
    });
  }

  goBack(): void {
    this.location.back();
  }
}
