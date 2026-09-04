import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-view',
    imports: [],
    templateUrl: './view.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './view.component.css'
})
export class ViewComponent {
  title = 'tinyMCE-angular';
  
  @Input() editorContent: string = 'CONTENIDO DE LA LECCIÓN';
  sanitizedContent: SafeHtml | undefined;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica si editorContent cambió y actualiza sanitizedContent
    if (changes['editorContent']) {
      this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
    }
  }
}
