import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AssignableItem } from '../../../../../core/interfaces/assignable-item.interce';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent  } from '@angular/material/paginator';

@Component({
  selector: 'app-assign',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
  ],
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit {
  @Input() items1: AssignableItem[] = []; // Usuarios asignados
  @Input() items2: AssignableItem[] = []; // Usuarios no asignados
  @Output() updateAssigned = new EventEmitter<AssignableItem[]>();

  filteredItems1: AssignableItem[] = [];
  filteredItems2: AssignableItem[] = [];
  paginatedItems1: AssignableItem[] = [];
  paginatedItems2: AssignableItem[] = [];
  pageSize1: number = 5;
  pageIndex1: number = 0;
  pageSize2: number = 5;
  pageIndex2: number = 0;

  ngOnInit(): void {
    this.filteredItems1 = [...this.items1];
    this.filteredItems2 = [...this.items2];
    this.updatePagination('items1');
    this.updatePagination('items2');
  }

  // Filtro dinámico
  applyFilter(event: Event, list: 'items1' | 'items2'): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (list === 'items1') {
      this.filteredItems1 = this.items1.filter(item =>
        this.matchesFilter(item, filterValue)
      );
      this.pageIndex1 = 0;
      this.updatePagination('items1');
    } else {
      this.filteredItems2 = this.items2.filter(item =>
        this.matchesFilter(item, filterValue)
      );
      this.pageIndex2 = 0;
      this.updatePagination('items2');
    }
  }

  private matchesFilter(item: AssignableItem, filter: string): boolean {
    return (
      item.id.toLowerCase().includes(filter) ||
      (item.name?.toLowerCase().includes(filter) ?? false) ||
      (item.title?.toLowerCase().includes(filter) ?? false) ||
      (item.registrationNumber?.toLowerCase().includes(filter) ?? false)
    );
  }

  // Actualizar la paginación
  onPageChange(event: PageEvent, list: 'items1' | 'items2'): void {
    if (list === 'items1') {
      this.pageSize1 = event.pageSize;
      this.pageIndex1 = event.pageIndex;
      this.updatePagination('items1');
    } else {
      this.pageSize2 = event.pageSize;
      this.pageIndex2 = event.pageIndex;
      this.updatePagination('items2');
    }
  }

  private updatePagination(list: 'items1' | 'items2'): void {
    if (list === 'items1') {
      const start = this.pageIndex1 * this.pageSize1;
      const end = start + this.pageSize1;
      this.paginatedItems1 = this.filteredItems1.slice(start, end);
    } else {
      const start = this.pageIndex2 * this.pageSize2;
      const end = start + this.pageSize2;
      this.paginatedItems2 = this.filteredItems2.slice(start, end);
    }
  }

  // Manejar el evento de arrastrar y soltar
  drop(event: CdkDragDrop<AssignableItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Sincronizar las listas filtradas
      this.filteredItems1 = [...this.items1];
      this.filteredItems2 = [...this.items2];
      this.updatePagination('items1');
      this.updatePagination('items2');
      this.updateAssigned.emit(this.items1);
    }
  }
}
