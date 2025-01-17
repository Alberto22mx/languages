import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth/auth.service';
import { GroupsModalComponent } from '../modals/groups-modal/groups-modal.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { GroupsService } from '../../../core/services/groups/groups.service';
import { Group } from '../../../core/interfaces/groups.interface';
import {MatMenuModule} from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { GroupsAssignModalComponent } from '../modals/groups-assign-modal/groups-assign-modal.component';

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule],
  templateUrl: './admin-groups.component.html',
  styleUrl: './admin-groups.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminGroupsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  group: Group[] = [];

  totalGroups = 0;
  pageSize = 10;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'level', 'schedule', 'state', 'actions'];
  dataSource!: MatTableDataSource<Group>;

  expandedElement: any | null;

  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.groupsService.getGroups().subscribe((response: any) => {
      this.group = response;
      this.totalGroups = response.length;
      this.dataSource = new MatTableDataSource(response);
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
    this.getUsers();
  }

  openDialogCreate(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(GroupsModalComponent, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getUsers();
      } 
      // if (result) {
      //   if (result.status === 'success') {
      //     console.log('Datos guardados:', result.data);
      //   } else if (result.status === 'cancel') {
      //     console.log('El usuario canceló la operación');
      //   } else if (result.status === 'error') {
      //     console.log('Error:', result.message);
      //   }
      // } else {
      //   console.log('El modal se cerró sin acción específica');
      // }
    });
  }

  openDialogAssign(id: string): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(GroupsAssignModalComponent, {
      width: '750px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getUsers();
      } 
      // if (result) {
      //   if (result.status === 'success') {
      //     console.log('Datos guardados:', result.data);
      //   } else if (result.status === 'cancel') {
      //     console.log('El usuario canceló la operación');
      //   } else if (result.status === 'error') {
      //     console.log('Error:', result.message);
      //   }
      // } else {
      //   console.log('El modal se cerró sin acción específica');
      // }
    });
  }
}
