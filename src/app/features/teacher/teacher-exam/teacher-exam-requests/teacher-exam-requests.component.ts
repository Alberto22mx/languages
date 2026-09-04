import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProgressService } from '../../../../core/services/progress/progress.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';

@Component({
    selector: 'app-teacher-exam-requests',
    imports: [CommonModule, MatTableModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './teacher-exam-requests.component.html'
})
export class TeacherExamRequestsComponent implements OnInit {
  displayedColumns = ['student', 'exam', 'reason', 'createdAt', 'status', 'actions'];
  requests: any[] = [];

  constructor(private readonly progressService: ProgressService, private readonly alertsService: AlertsService) {}

  ngOnInit(): void { this.load(); }

  review(request: any, decision: 'approved' | 'rejected'): void {
    this.progressService.reviewExamAccessRequest(request.id, decision).subscribe({
      next: () => { this.alertsService.success(decision === 'approved' ? 'Nueva oportunidad autorizada.' : 'Solicitud rechazada.'); this.load(); },
      error: (error) => this.alertsService.warning(error.error?.message ?? 'No fue posible revisar la solicitud.'),
    });
  }

  private load(): void {
    this.progressService.getExamAccessRequests().subscribe({
      next: (requests) => this.requests = requests,
      error: () => this.alertsService.warning('No fue posible cargar las solicitudes.'),
    });
  }
}
