import { Component, OnInit } from '@angular/core';
import { Tablero } from './scenes/Tablero';

@Component({
  selector: 'app-tom-game',
  standalone: true,
  imports: [],
  templateUrl: './tom-game.component.html',
  styleUrl: './tom-game.component.css'
})
export class TomGameComponent extends Phaser.Scene implements OnInit {
constructor() {
    super({ key: 'TomGameComponent' });
  }

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      version: '1.0.0',
      width: 400,
      height: 300,
      backgroundColor: '#002058',
      pixelArt: true,
      // Aquí defines las escenas
      scene: [Tablero],
      zoom: 2,
      physics: {
        default: 'arcade',
        arcade: { debug: true }
      },
    };

    new Phaser.Game(config);
  }
}
