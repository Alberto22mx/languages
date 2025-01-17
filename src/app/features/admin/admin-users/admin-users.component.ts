import { Component, AfterViewInit, ViewChild, inject, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../../../core/interfaces/user.interface';
import { UsersService } from '../../../core/services/users/users.service';
import { UserModalComponent } from '../modals/user-modal/user-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule,
    
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  users: User[] = [];

  totalUsers = 0;
  pageSize = 5;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'registrationNumber', 'phone', 'email', 'state', 'userType'];
  dataSource!: MatTableDataSource<User>;

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsersPaginated(this.currentPage, this.pageSize).subscribe((response: any) => {
      console.log(response);
      this.users = response.data;
      this.totalUsers = response.total;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

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

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '750px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });  
  }
}
