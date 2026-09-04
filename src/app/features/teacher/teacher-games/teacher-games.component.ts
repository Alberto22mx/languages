import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { GamesService } from '../../../core/services/games/games.service';
import { Games } from '../../../core/interfaces/games.interface';

@Component({
    selector: 'app-teacher-games',
    templateUrl: './teacher-games.component.html',
    styleUrls: ['./teacher-games.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
]
})
export class TeacherGamesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'type', 'url', 'active', 'actions'];
  dataSource: MatTableDataSource<Games>;
  totalGames = 0;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private gamesService: GamesService) {
    this.dataSource = new MatTableDataSource<Games>();
  }

  ngOnInit(): void {
    this.gamesService.findAll().subscribe(games => {
      this.dataSource.data = games;
      this.totalGames = games.length;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    // Implementar lógica para abrir diálogo de creación
  }

  openEdit(game: Games) {
    // Implementar lógica para editar juego
  }

  previewGame(game: Games) {
    // Implementar lógica para previsualizar juego
  }

  onPageChange(event: any) {
    // Implementar lógica de paginación
  }
}
