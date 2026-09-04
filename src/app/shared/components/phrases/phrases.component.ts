import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Phrase } from '../../../core/interfaces/phrases.interface';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-phrases',
    imports: [FormsModule],
    templateUrl: './phrases.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './phrases.component.css'
})
export class PhrasesComponent {
  @Input() phrases: Phrase[] = []; // Recibe el grupo de frases
  @Output() answersSubmitted = new EventEmitter<Phrase[]>(); // Emite todas las respuestas

  submitAllAnswers() {
    this.answersSubmitted.emit(this.phrases); // Enviar todas las respuestas al padre
  }
}
