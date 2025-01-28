import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MainScene } from './scenes/main.scene';

@Component({
  selector: 'app-games-scena',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './games-scena.component.html',
  styleUrl: './games-scena.component.css'
})
export class GamesScenaComponent extends Phaser.Scene implements OnInit {
  constructor(private router: Router) {
    super({ key: 'GamesScenaComponent' });
  }

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      version: '1.0.0',
      width: 640,
      height: 360,
      backgroundColor: '#002058',
      pixelArt: true,
      // Aquí defines las escenas
      scene: [MainScene],
    };

    new Phaser.Game(config);
  }

  goBack(): void {
    this.router.navigate(['/modulos/i/games']);
  }
}
