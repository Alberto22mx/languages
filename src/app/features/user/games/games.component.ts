import { Component } from '@angular/core';
import { AbcComponent } from './components/abc/abc.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [AbcComponent],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {

}
