import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GamesModalComponent } from '../modals/games-modal/games-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { GamesService } from '../../../core/services/games/games.service';
import { Games } from '../../../core/interfaces/games.interface';
import { AlertsService } from '../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-admin-games',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './admin-games.component.html',
  styleUrl: './admin-games.component.css'
})
export class AdminGamesComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  games: Games[] = [];

  totalUsers = 0;
  pageSize = 10;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['title', 'instructions', 'actions'];
  dataSource!: MatTableDataSource<Games>;

  constructor(
    private gamesService: GamesService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.getGames();
  }

  getGames() {
    this.gamesService.findAll().subscribe((response: any) => {
      this.games = response;
      this.totalUsers = response.total;
      this.dataSource = new MatTableDataSource(this.games);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getGames();
  }

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(GamesModalComponent, {
      width: '700px',
      data: null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        this.getGames();
      }
    });
  }

  openEditModal(game: any): void {
    const dialogRef = this.dialog.open(GamesModalComponent, {
      width: '500px',
      data: { game }, // Pasamos los datos del juego a editar
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit') {
        this.getGames();
      }
    });
  }

  async confirmDelete(id: string) {
    const confirmed = await this.alertsService.confirm(
      '¿Seguro que deseas eliminar este elemento?',
      'Confirmación de Eliminación'
    );
    if (confirmed) {
      this.gamesService.delete(id).subscribe({
        next: (res) => {
          this.getGames();
          this.alertsService.success('Elemento eliminado con éxito.');
        },
        error: (err) => {
          this.alertsService.warning('Eliminación cancelada.');
        },
      });
    }
  }
}
