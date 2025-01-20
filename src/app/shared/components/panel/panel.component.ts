import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, MatButtonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
  title = 'ADMINISTRACION DE LECCIONES';
  editorContent = '<p>¡Hola! Este es un texto inicial.</p>';

  constructor() {}

  saveLesson() {
  }
}
