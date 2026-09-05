import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { AssignableItem } from '../../../../../core/interfaces/assignable-item.interce';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-assign',
    imports: [
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
],
    templateUrl: './assign.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit, OnChanges {
  @Input() items1: AssignableItem[] = []; // Usuarios asignados
  @Input() items2: AssignableItem[] = []; // Usuarios no asignados
  @Input() maxAssigned?: number;
  @Output() assignmentChanged = new EventEmitter<{
    assigned: AssignableItem[];
    unassigned: AssignableItem[];
  }>();

  filteredItems1: AssignableItem[] = [];
  filteredItems2: AssignableItem[] = [];
  paginatedItems1: AssignableItem[] = [];
  paginatedItems2: AssignableItem[] = [];
  pageSize1: number = 5;
  pageIndex1: number = 0;
  pageSize2: number = 5;
  pageIndex2: number = 0;
  selectedAssignedIds = new Set<string>();
  selectedUnassignedIds = new Set<string>();

  ngOnInit(): void {
    this.initializeFiltersAndPagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items1'] || changes['items2']) {
      this.initializeFiltersAndPagination();
      this.selectedAssignedIds.clear();
      this.selectedUnassignedIds.clear();
    }
  }

  // Inicializar filtros y paginación
  private initializeFiltersAndPagination(): void {
    this.filteredItems1 = [...this.items1];
    this.filteredItems2 = [...this.items2];
    this.updatePagination('items1');
    this.updatePagination('items2');
  }

  // Filtro dinámico
  applyFilter(event: Event, list: 'items1' | 'items2'): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (list === 'items1') {
      this.filteredItems1 = this.items1.filter((item) => this.matchesFilter(item, filterValue));
      this.pageIndex1 = 0;
      this.updatePagination('items1');
    } else {
      this.filteredItems2 = this.items2.filter((item) => this.matchesFilter(item, filterValue));
      this.pageIndex2 = 0;
      this.updatePagination('items2');
    }
  }

  private matchesFilter(item: AssignableItem, filter: string): boolean {
    const lowerFilter = filter.toLowerCase();
    return (
      (item.id?.toLowerCase().includes(lowerFilter) ?? false) ||
      (item.name?.toLowerCase().includes(lowerFilter) ?? false) ||
      (item.title?.toLowerCase().includes(lowerFilter) ?? false) ||
      (item.registrationNumber?.toLowerCase().includes(lowerFilter) ?? false)
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

  drop(event: CdkDragDrop<AssignableItem[]>, target: 'assigned' | 'unassigned'): void {
    const item = event.item.data as AssignableItem;
    const isAssigned = this.items1.some((assignedItem) => assignedItem.id === item.id);

    if ((target === 'assigned' && isAssigned) || (target === 'unassigned' && !isAssigned)) return;
    this.moveItems([item.id], target === 'assigned');
  }

  toggleSelection(id: string, list: 'assigned' | 'unassigned', selected: boolean): void {
    const selection = list === 'assigned' ? this.selectedAssignedIds : this.selectedUnassignedIds;
    if (selected) selection.add(id);
    else selection.delete(id);
  }

  moveSelectedToAssigned(): void {
    this.moveItems([...this.selectedUnassignedIds], true);
  }

  moveSelectedToUnassigned(): void {
    this.moveItems([...this.selectedAssignedIds], false);
  }

  canAssignMore(): boolean {
    return this.maxAssigned === undefined || this.items1.length < this.maxAssigned;
  }

  private moveItems(ids: string[], toAssigned: boolean): void {
    if (ids.length === 0 || (toAssigned && !this.canAssignMore())) return;

    const source = toAssigned ? this.items2 : this.items1;
    const destination = toAssigned ? this.items1 : this.items2;
    const limit = toAssigned && this.maxAssigned !== undefined
      ? this.maxAssigned - this.items1.length
      : ids.length;
    const movedItems = source.filter((item) => ids.includes(item.id)).slice(0, limit);
    if (movedItems.length === 0) return;

    const movedIds = new Set(movedItems.map((item) => item.id));
    if (toAssigned) {
      this.items1 = [...destination, ...movedItems];
      this.items2 = source.filter((item) => !movedIds.has(item.id));
    } else {
      this.items1 = source.filter((item) => !movedIds.has(item.id));
      this.items2 = [...destination, ...movedItems];
    }

    this.assignmentChanged.emit({
      assigned: [...this.items1],
      unassigned: [...this.items2],
    });
    this.initializeFiltersAndPagination();
    this.selectedAssignedIds.clear();
    this.selectedUnassignedIds.clear();
  }
  
}
