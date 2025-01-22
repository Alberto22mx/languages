import { Component } from '@angular/core';
import { ChatComponent } from '../../../shared/components/chat/chat.component';

@Component({
  selector: 'app-virtual-tutor',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './virtual-tutor.component.html',
  styleUrl: './virtual-tutor.component.css'
})
export class VirtualTutorComponent {

}
