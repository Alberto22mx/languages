import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { ProgressService } from '../../../../core/services/progress/progress.service';
import { TeacherExamGradeDialogComponent } from './teacher-exam-grade-dialog.component';

interface ExamResult {
  student: {
    id: string;
    firstName: string;
    lastNameFather: string;
    lastNameMother: string;
    registrationNumber: string;
  };
  submission: {
    _id: string;
    createdAt: string;
    score?: number;
    feedback?: string;
    gradedAt?: string;
    answers: any[];
  } | null;
}

@Component({
  selector: 'app-teacher-exam-grades',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule],
  templateUrl: './teacher-exam-grades.component.html',
  styleUrl: './teacher-exam-grades.component.css',
})
export class TeacherExamGradesComponent implements OnInit {
  group: any;
  exam: any;
  studentId?: string;
  results: ExamResult[] = [];
  displayedColumns = ['student', 'status', 'submittedAt', 'score', 'feedback', 'actions'];

  constructor(
    private progressService: ProgressService,
    private alertsService: AlertsService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.group = state?.group;
    this.exam = state?.exam;
    this.studentId = state?.studentId;
    if (!this.group?.id || !this.exam?.id) {
      this.router.navigate(['/modulos/ii/teacher-groups']);
      return;
    }
    this.loadResults();
  }

  loadResults(): void {
    this.progressService.getExamResults(this.group.id, this.exam.id).subscribe({
      next: (results: ExamResult[]) => {
        this.results = this.studentId ? results.filter((result) => result.student.id === this.studentId) : results;
      },
      error: () => this.alertsService.warning('No fue posible cargar las entregas del examen.'),
    });
  }

  review(result: ExamResult): void {
    if (!result.submission) {
      return;
    }
    const dialogRef = this.dialog.open(TeacherExamGradeDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { exam: this.exam, result },
    });
    dialogRef.afterClosed().subscribe((evaluation) => {
      if (evaluation) this.saveEvaluation(result, evaluation.answers, evaluation.feedback);
    });
  }

  private saveEvaluation(result: ExamResult, answers: any[], feedback?: string): void {
    this.progressService.gradeExamSubmission(result.submission!._id, answers, feedback).subscribe({
      next: () => {
        this.alertsService.success('Calificación guardada.');
        this.loadResults();
      },
      error: () => this.alertsService.warning('No fue posible guardar la calificación.'),
    });
  }

  goBack(): void {
    this.location.back();
  }
}
