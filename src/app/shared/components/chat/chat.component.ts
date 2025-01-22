import { Component } from '@angular/core';
import { OpenaiService } from '../../../core/services/ai/openai.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
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
