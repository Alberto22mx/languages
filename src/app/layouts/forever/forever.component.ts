import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./../../shared/components/header/header.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './../../shared/components/sidenav/sidenav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-forever',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidenavComponent,HeaderComponent, MatSidenavModule, FooterComponent],
  templateUrl: './forever.component.html',
  styleUrl: './forever.component.css'
})
export class ForeverComponent {

}
