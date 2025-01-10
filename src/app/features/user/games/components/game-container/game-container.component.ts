import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [],
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.css'
})
export class GameContainerComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 525,
      height: 450,
      parent: 'game-container',
      backgroundColor: '#3498db',
      scene: {
        preload: this.preload,
        create: this.create
      }
    };

    new Phaser.Game(config);
  }

  preload(this: Phaser.Scene) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    letters.forEach(letter => {
      this.load.audio(letter, `assets/sounds/abc/${letter}.mp3`);
    });
  }

  create(this: Phaser.Scene) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const style = { font: '48px Arial', fill: '#fff' };

    letters.forEach((letter, index) => {
      const x = 70 + (index % 6) * 70;
      const y = 70 + Math.floor(index / 6) * 70;
      const text = this.add.text(x, y, letter, style).setInteractive();

      text.on('pointerdown', () => {
        this.sound.play(letter.toLowerCase());
      });
    });
  }
}
