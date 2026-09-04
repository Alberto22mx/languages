import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { Lessons } from '../../../../core/interfaces/lessons.interface';
import { ViewComponent } from '../../../../shared/components/view/view.component';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-user-lessons-content',
    imports: [ViewComponent, MatIconModule, MatButtonModule],
    templateUrl: './user-lessons-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './user-lessons-content.component.css'
})
export class UserLessonsContentComponent implements OnInit {
  data: Lessons;
  content?: string;

  constructor(
    private lessonsService: LessonsService,
    private alertsService: AlertsService,
    private router: Router,
    ) {
    this.data = history.state || [];
  }

  ngOnInit() {
    if (this.data.id)
    this.lessonsService.findOne(this.data.id).subscribe(res => {
      if (res.content) {
        this.content = res.content;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/modulos/i/lessons']); // Redirige a la ruta anterior
  }
}
