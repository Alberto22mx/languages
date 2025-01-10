import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { UsersService } from '../../../../../core/services/users/users.service';

@Component({
  selector: 'app-abc',
  standalone: true,
  imports: [],
  templateUrl: './abc.component.html',
  styleUrl: './abc.component.css'
})
export class AbcComponent extends Phaser.Scene implements OnInit {
  clickedLetters: string[] = [];

  constructor(private userService: UsersService) {
    super({ key: 'AbcComponent' });
  }

  ngOnInit(): void {
    this.userService.getUsers()
          .subscribe((result) => {
            console.log(result);
          });
    this.clickedLetters = ['E','K','L','R'];
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 525,
      height: 450,
      parent: 'game-container',
      backgroundColor: '#002058',
      scene: this
    };

    new Phaser.Game(config);
  }

  preload() {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    letters.forEach(letter => {
      this.load.audio(letter, `assets/sounds/abc/${letter}.mp3`);
    });
  }

  create() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const style = { font: '48px Arial', fill: '#fff' };

    letters.forEach((letter, index) => {
      const x = 70 + (index % 6) * 70;
      const y = 70 + Math.floor(index / 6) * 70;
      const text = this.add.text(x, y, letter, style).setInteractive();
      if (this.clickedLetters.includes(letter)) {
        text.setStyle({ fill: '#ff0' });
      }

      text.on('pointerdown', () => {
        if (!this.clickedLetters.includes(letter)) {
          this.sound.play(letter.toLowerCase());
          text.setStyle({ fill: '#ff0' }); // Cambia el color de la letra a amarillo
          this.clickedLetters.push(letter);
        }
      });
    });
  }

  getClickedLetters() {
    console.log(this.clickedLetters);
  }
}
