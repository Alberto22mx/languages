import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProgressChartsComponent } from '../../../shared/progress/progress-charts/progress-charts.component';

@Component({
    selector: 'app-admin-progress',
    imports: [ProgressChartsComponent],
    templateUrl: './admin-progress.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-progress.component.css'
})
export class AdminProgressComponent {

}
