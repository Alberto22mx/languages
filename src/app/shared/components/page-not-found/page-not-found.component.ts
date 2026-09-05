import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    imports: [MatButtonModule],
    templateUrl: './page-not-found.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent implements OnInit {

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.navigate(['/modulos/i/dashboard']);
  }
}
