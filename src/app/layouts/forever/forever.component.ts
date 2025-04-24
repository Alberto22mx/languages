import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HeaderComponent } from "./../../shared/components/header/header.component";
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SidenavComponent } from './../../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-forever',
  templateUrl: './forever.component.html',
  styleUrls: ['./forever.component.css'],
  standalone: true,
  imports: [
    CommonModule,
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
