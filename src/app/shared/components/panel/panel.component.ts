
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Location } from '@angular/common';

@Component({
    selector: 'app-panel',
    imports: [EditorModule, FormsModule, MatButtonModule, MatIconModule],
    templateUrl: './panel.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {
  @Input() title: string = 'CONTENIDO DE LA LECCIÓN';
  @Input() initialContent: string = '';
  @Output() contentChange = new EventEmitter<string>();

  editorContent: string = '';

  constructor(
    private location: Location
  ) {}

  ngOnInit(): void {
    this.editorContent = this.initialContent || '<p>Texto inicial por defecto</p>';
  }

  saveContent(): void {
    this.contentChange.emit(this.editorContent);
  }

  goBack(): void {
    this.location.back(); // Regresa a la página anterior
  }
}
