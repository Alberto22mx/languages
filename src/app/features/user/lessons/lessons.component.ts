import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GroupsService } from '../../../core/services/groups/groups.service';
import { GroupAllData } from '../../../core/interfaces/groups.interface';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lessons',
    imports: [MatListModule, MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule],
    templateUrl: './lessons.component.html',
    styleUrl: './lessons.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonsComponent implements OnInit {
  idUser: string | null;
  grupos: GroupAllData[] = [];
  isLoading = true;

  constructor(
    private groupsService: GroupsService, 
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.idUser = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.getLessons();
  }

  getLessons(): void {
    if (!this.idUser) {
      this.isLoading = false;
      return;
    }

    this.groupsService.getGroupWithRelations(this.idUser).subscribe({
      next: (result) => {
        this.grupos = result
          .map((grupo) => ({
            ...grupo,
            lessons: [...(grupo.lessons ?? [])].sort(
              (first, second) => this.getCreatedAt(second) - this.getCreatedAt(first),
            ),
          }))
          .sort((first, second) => this.getLatestLessonDate(second) - this.getLatestLessonDate(first));
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.grupos = [];
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  private getLatestLessonDate(grupo: GroupAllData): number {
    return Math.max(0, ...(grupo.lessons ?? []).map((lesson) => this.getCreatedAt(lesson)));
  }

  private getCreatedAt(lesson: { createdAt?: string }): number {
    return lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
  }

  openEdit(lessons: any): void {
    this.router.navigate(['/modulos/i/lessons-content'], {
      state: { ...lessons },
    });
  }
}
