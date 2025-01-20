import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  title = 'tinyMCE-angular';
    editorContent = '<p><span style="font-size: 18pt; color: #e03e2d;"><strong>&iexcl;Hola! Este es un texto inicial.</strong></span></p>';
  
    sanitizedContent: SafeHtml;
  
    constructor(private sanitizer: DomSanitizer) {
      this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
    }
}
