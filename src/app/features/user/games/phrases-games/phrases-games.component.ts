import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Phrase } from '../../../../core/interfaces/phrases.interface';
import { PhrasesComponent } from '../../../../shared/components/phrases/phrases.component';

@Component({
    selector: 'app-phrases-games',
    imports: [PhrasesComponent],
    templateUrl: './phrases-games.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './phrases-games.component.css'
})
export class PhrasesGamesComponent {
  
  phrases: Phrase[] = [
    { text: "Las ranas ______ al lago.", type: 'multiple', options: ["saltan", "corren", "nadan"], correctAnswer: "saltan" },
    { text: "Los niños ______ en el parque.", type: 'free' },
    { text: "El sol ______ todas las mañanas.", type: 'multiple', options: ["brilla", "duerme", "se esconde"], correctAnswer: "brilla" },
    { text: "El perro ______ cuando ve a su dueño.", type: 'multiple', options: ["ladra", "corre", "baila"], correctAnswer: "ladra" },
    { text: "Las estrellas ______ en la noche.", type: 'free' }
  ];

  handleAnswersSubmission(phrases: Phrase[]) {
    console.log('Respuestas enviadas:', phrases);

    let message = 'Resultados:\n\n';
    phrases.forEach(phrase => {
      if (phrase.type === 'multiple') {
        const isCorrect = phrase.userAnswer === phrase.correctAnswer ? '✔ Correcto' : '❌ Incorrecto';
        message += `Frase: "${phrase.text}"\nTu respuesta: "${phrase.userAnswer}"\nResultado: ${isCorrect}\n\n`;
      } else {
        message += `Frase: "${phrase.text}"\nTu respuesta: "${phrase.userAnswer}"\nGuardado para revisión.\n\n`;
      }
    });

    alert(message);
  }
}
