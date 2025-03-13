import { Component, OnInit } from '@angular/core';
import { AbcComponent } from './components/abc/abc.component';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GroupsService } from '../../../core/services/groups/groups.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { GroupAllData } from '../../../core/interfaces/groups.interface';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule, MatStepperModule, MatButtonModule, MatIconModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit { 
  idUser: string | null;
  grupos: GroupAllData[] = [];

  constructor(
    private groupsService: GroupsService, 
    private authService: AuthService,
    private router: Router,
  ) {
    this.idUser = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.getLessons();
  }

  getLessons() {
    if (this.idUser) {
      this.groupsService.getGroupWithRelations(this.idUser).subscribe(result => {
        console.log(result);
        this.grupos = result;
      });
    }
  }

  openEdit(game: any): void {
    this.router.navigate(['/modulos/i/games-content/' + game.url], {
      state: { datos: game }
    });
  }}
