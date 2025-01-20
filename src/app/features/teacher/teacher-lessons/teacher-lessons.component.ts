import { Component } from '@angular/core';
import { PanelComponent } from '../../../shared/components/panel/panel.component';

@Component({
  selector: 'app-teacher-lessons',
  standalone: true,
  imports: [PanelComponent],
  templateUrl: './teacher-lessons.component.html',
  styleUrl: './teacher-lessons.component.css'
})
export class TeacherLessonsComponent {
}
