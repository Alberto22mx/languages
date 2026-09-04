import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OpenaiService } from '../../../core/services/ai/openai.service';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-chat',
    imports: [FormsModule],
    templateUrl: './chat.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './chat.component.css'
})
export class ChatComponent {
  userMessage = '';
  chatResponse = '';

  constructor(private openaiService: OpenaiService) {}

  sendMessage() {
    this.openaiService.generateResponse(this.userMessage).subscribe(
      (response) => {
        this.chatResponse = response.choices[0].message.content;
      },
      (error) => {
        console.error('Error al obtener respuesta:', error);
      }
    );
  }
}
