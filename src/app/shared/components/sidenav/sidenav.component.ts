import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  isUser: boolean = false;
  isTeacher: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    const userType = this.authService.getUserType();
    if (userType == 'user') {
      this.isUser = true;
    } else if(userType == 'teacher') {
      this.isTeacher = true;
    } else if(userType == 'admin') {
      this.isAdmin = true;
    }
  }

}
