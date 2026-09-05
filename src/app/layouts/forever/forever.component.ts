import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "./../../shared/components/header/header.component";
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SidenavComponent } from './../../shared/components/sidenav/sidenav.component';

@Component({
    selector: 'app-forever',
    templateUrl: './forever.component.html',
    styleUrls: ['./forever.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
    RouterModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent
]
})
export class ForeverComponent {
}
