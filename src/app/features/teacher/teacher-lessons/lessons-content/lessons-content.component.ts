import { Component, Input, OnInit } from '@angular/core';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';
import { CommonModule } from '@angular/common';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { Lessons } from '../../../../core/interfaces/lessons.interface';

@Component({
  selector: 'app-lessons-content',
  standalone: true,
  imports: [CommonModule, PanelComponent],
  templateUrl: './lessons-content.component.html',
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
    this.title = 'CONTENIDO DE LA LECCIÓN | ' + history.state.title || '';
    this.lessonContent = history.state.content;
  }

  handleContentChange(updatedContent: string): void {
    const lesson: Lessons = {content: updatedContent};
    this.lessonsService.update(this.idLesson, lesson).subscribe({
      next: (res) => {
        this.alertsService.success('Elemento eliminado con éxito.');
      },
      error: (err) => {
        this.alertsService.warning('Eliminación cancelada.');
      },
    });
  }
}
