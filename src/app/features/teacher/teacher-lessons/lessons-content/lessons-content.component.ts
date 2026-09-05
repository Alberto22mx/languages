import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';

import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { Lessons } from '../../../../core/interfaces/lessons.interface';

@Component({
    selector: 'app-lessons-content',
    imports: [PanelComponent],
    templateUrl: './lessons-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './lessons-content.component.css'
})
export class LessonsContentComponent implements OnInit {
  idLesson: string = '';
  title: string = '';
  lessonContent: string = '';

  constructor(
    private lessonsService: LessonsService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit(): void {
    this.idLesson = history.state.id;
    this.title = `CONTENIDO DE LA LECCIÓN | ${history.state.title ?? ''}`;
    this.lessonContent = history.state.content;
  }

  handleContentChange(updatedContent: string): void {
    const lesson: Lessons = {content: updatedContent};
    this.lessonsService.update(this.idLesson, lesson).subscribe({
      next: () => {
        this.alertsService.success('Contenido de la lección guardado con éxito.');
      },
      error: () => {
        this.alertsService.warning('No fue posible guardar el contenido de la lección.');
      },
    });
  }
}
