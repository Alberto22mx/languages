import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule, MatStepperModule, MatButtonModule, MatIconModule],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsComponent implements OnInit {
  idUser: string | null;
  grupos: GroupAllData[] = [];

  constructor(
    private groupsService: GroupsService, 
    private authService: AuthService,
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
        this.grupos = result;
      });
    }
  }

  openEdit(lessons: any): void {
    this.router.navigate(['/modulos/i/lessons-content'], {
      state: { ...lessons },
    });
  }
}
