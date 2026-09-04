import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
    selector: 'app-about',
    imports: [MatCardModule, MatFormFieldModule, MatCheckboxModule],
    templateUrl: './about.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './about.component.css'
})
export class AboutComponent {

}
