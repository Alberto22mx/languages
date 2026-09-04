import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { GroupsService } from '../../../core/services/groups/groups.service';
import { Group, GroupAllData } from '../../../core/interfaces/groups.interface';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProgressService } from '../../../core/services/progress/progress.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule, MatStepperModule, MatButtonModule, MatIconModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamComponent implements OnInit {
readonly dialog = inject(MatDialog);
  idUser: string | null;
  grupos: GroupAllData[] = [];
  examStatuses: Record<string, any> = {};
  
    constructor(
      private groupsService: GroupsService, 
      private authService: AuthService,
      private progressService: ProgressService,
      private router: Router,
    ) {
      this.idUser = this.authService.getUserId();
    }
  
    ngOnInit(): void {
      this.getLessons();
    }
  
    getLessons() {
      if (this.idUser) {
        this.groupsService.getGroupWithRelations(this.idUser).subscribe(result => {
          console.log(result);
          this.grupos = result;
          result.forEach((group) => group.exams?.forEach((exam) => this.loadExamStatus(exam.id)));
        });
      }
  }

  private loadExamStatus(examId?: string): void {
    if (!examId) {
      return;
    }
    this.progressService.getMyExamStatus(examId).subscribe((status) => {
      this.examStatuses[examId] = status;
    });
  }
  
    openEdit(exam: any): void {
      this.router.navigate(['/modulos/i/exam-content'], {
        state: { ...exam },
      });
    }
}
