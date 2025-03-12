import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainWordScene } from './scenes/main.word.scene';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-word-search',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.css'
})
export class WordSearchComponent extends Phaser.Scene implements OnInit {
  constructor(private router: Router) {
    super({ key: 'WordSearchComponent' });
  }

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      version: '1.0.0',
      width: 600,
      height: 400,
      backgroundColor: '#002058',
      pixelArt: true,
      // Aquí defines las escenas
      scene: [MainWordScene],
      zoom: 2,
    };

    new Phaser.Game(config);
  }

  goBack(): void {
    this.router.navigate(['/modulos/i/games']);
  }
}
