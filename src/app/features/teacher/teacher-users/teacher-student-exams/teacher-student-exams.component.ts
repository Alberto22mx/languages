import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { ProgressService } from '../../../../core/services/progress/progress.service';

@Component({
  selector: 'app-teacher-student-exams',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule],
  templateUrl: './teacher-student-exams.component.html',
  styleUrl: './teacher-student-exams.component.css',
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
  ) {}

  ngOnInit(): void {
    this.student = history.state?.student;
    if (!this.student?.id) {
      this.router.navigate(['/modulos/ii/teacher-users']);
      return;
    }
    this.progressService.getStudentExamResults(this.student.id).subscribe({
      next: (results) => this.results = results,
      error: () => this.alertsService.warning('No fue posible cargar los exámenes del alumno.'),
    });
  }

  review(result: any): void {
    this.router.navigate(['/modulos/ii/teacher-exam-grades'], {
      state: { group: { id: result.groupId }, exam: result.exam, studentId: this.student.id },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
