import { Component } from '@angular/core';
import { ZoomService } from '../../../core/services/zoom/zoom.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private zoomService: ZoomService) {}
  
  setZoom(className: string) {
    this.zoomService.setZoom(className);
  }
}
