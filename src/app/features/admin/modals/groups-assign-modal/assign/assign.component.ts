import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AssignableItem } from '../../../../../core/interfaces/assignable-item.interce';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatPaginator, ],
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit {
  @Input() items1: AssignableItem[] = [];
  @Input() items2: AssignableItem[] = [];
  @Output() updateAssigned = new EventEmitter<AssignableItem[]>();

  ngOnInit(): void {
  }

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
      this.updateAssigned.emit(this.items1);
      console.log('Elemento movido de:', event.previousContainer.id);
      console.log('a:', event.container.id);
      console.log('Elemento:', event.container.data[event.currentIndex]);
    }
  }
}
