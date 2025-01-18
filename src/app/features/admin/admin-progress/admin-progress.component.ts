import { Component } from '@angular/core';
import { ProgressChartsComponent } from '../../../shared/progress/progress-charts/progress-charts.component';

@Component({
  selector: 'app-admin-progress',
  standalone: true,
  imports: [ProgressChartsComponent],
  templateUrl: './admin-progress.component.html',
  styleUrl: './admin-progress.component.css'
})
export class AdminProgressComponent {

}
