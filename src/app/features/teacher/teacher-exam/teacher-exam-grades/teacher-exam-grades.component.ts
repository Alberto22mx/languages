import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { ProgressService } from '../../../../core/services/progress/progress.service';

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
  draftScore?: number | null;
  draftFeedback?: string;
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
  results: ExamResult[] = [];
  displayedColumns = ['student', 'status', 'submittedAt', 'answers', 'score', 'feedback', 'actions'];

  constructor(
    private progressService: ProgressService,
    private alertsService: AlertsService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.group = state?.group;
    this.exam = state?.exam;
    if (!this.group?.id || !this.exam?.id) {
      this.router.navigate(['/modulos/ii/teacher-groups']);
      return;
    }
    this.loadResults();
  }

  loadResults(): void {
    this.progressService.getExamResults(this.group.id, this.exam.id).subscribe({
      next: (results: ExamResult[]) => {
        this.results = results.map((result) => ({
          ...result,
          draftScore: result.submission?.score ?? null,
          draftFeedback: result.submission?.feedback ?? '',
        }));
      },
      error: () => this.alertsService.warning('No fue posible cargar las entregas del examen.'),
    });
  }

  save(result: ExamResult): void {
    if (!result.submission) {
      return;
    }
    const score = Number(result.draftScore);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      this.alertsService.warning('La calificación debe ser un número entre 0 y 100.');
      return;
    }
    this.progressService.gradeExamSubmission(result.submission._id, score, result.draftFeedback).subscribe({
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
