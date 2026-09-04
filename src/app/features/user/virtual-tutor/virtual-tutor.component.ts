import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChatComponent } from '../../../shared/components/chat/chat.component';

@Component({
    selector: 'app-virtual-tutor',
    imports: [ChatComponent],
    templateUrl: './virtual-tutor.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './virtual-tutor.component.css'
})
export class VirtualTutorComponent {

}
