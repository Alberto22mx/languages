import { Component, inject, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CourseTemplate } from '../../../core/interfaces/course-template.interface';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { CourseTemplatesService } from '../../../core/services/course-templates/course-templates.service';
import { CourseTemplateModalComponent } from './course-template-modal.component';

@Component({
  selector: 'app-course-templates',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './course-templates.component.html',
  styleUrl: './course-templates.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CourseTemplatesComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly displayedColumns = ['name', 'course', 'level', 'version', 'content', 'actions'];
  readonly dataSource = new MatTableDataSource<CourseTemplate>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly courseTemplatesService: CourseTemplatesService,
    private readonly alertsService: AlertsService,
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.courseTemplatesService.findAll().subscribe((templates) => {
      this.dataSource.data = templates;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  openCreateDialog(): void {
    this.openDialog();
  }

  openEditDialog(template: CourseTemplate): void {
    this.openDialog(template);
  }

  async deleteTemplate(template: CourseTemplate): Promise<void> {
    const confirmed = await this.alertsService.confirm(
      `¿Eliminar la plantilla “${template.name}”? Los grupos relacionados conservarán su contenido, pero quedarán desvinculados de esta plantilla.`,
      'Confirmar eliminación',
    );
    if (!confirmed) return;

    this.courseTemplatesService.delete(template.id).subscribe({
      next: () => {
        this.loadTemplates();
        this.alertsService.success('Plantilla eliminada y grupos desvinculados.');
      },
      error: (error) => this.alertsService.warning(error.error?.message ?? 'No fue posible eliminar la plantilla.'),
    });
  }

  private openDialog(template?: CourseTemplate): void {
    const dialogRef = this.dialog.open(CourseTemplateModalComponent, {
      width: '720px',
      data: { template },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.status === 'success') this.loadTemplates();
      if (result?.status === 'error') this.alertsService.warning(result.message);
    });
  }
}
