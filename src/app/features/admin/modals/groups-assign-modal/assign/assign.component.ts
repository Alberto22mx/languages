import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AssignableItem } from '../../../../../core/interfaces/assignable-item.interce';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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

  ngOnInit(): void {
    this.filteredItems1 = [...this.items1];
    this.filteredItems2 = [...this.items2];
  }

  // Filtro dinámico que busca en todas las propiedades del objeto
  applyFilter(event: Event, list: 'items1' | 'items2'): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (list === 'items1') {
      this.filteredItems1 = this.items1.filter(item =>
        this.matchesFilter(item, filterValue)
      );
    } else {
      this.filteredItems2 = this.items2.filter(item =>
        this.matchesFilter(item, filterValue)
      );
    }
  }

  // Verifica si alguna propiedad del objeto coincide con el filtro
  private matchesFilter(item: AssignableItem, filter: string): boolean {
    return (
      item.id.toLowerCase().includes(filter) ||
      (item.name?.toLowerCase().includes(filter) ?? false) ||
      (item.title?.toLowerCase().includes(filter) ?? false) ||
      (item.registrationNumber?.toLowerCase().includes(filter) ?? false)
    );
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
      this.updateAssigned.emit(this.items1);
    }
  }
}
