import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainWordScene } from './scenes/main.word.scene';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { Games } from '../../../../core/interfaces/games.interface';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-word-search',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.css'
})
export class WordSearchComponent implements OnInit {
  private game!: Phaser.Game;
  private mainScene!: Phaser.Scene;
  private games!: Games;
  public wordsList: { english: string; spanish: string }[] = []; // Lista de palabras
  private foundWordsCount = 0; // Contador de palabras encontradas

  constructor(private router: Router, private alertsService: AlertsService,) {}

  ngOnInit(): void {
    this.games = window.history.state.datos;
    console.log(this.games);
    if (this.games && this.games.data) {
      this.wordsList = this.games.data; // Guardar las palabras en la lista para el *ngFor
      console.log("Entro", this.wordsList )
    }
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      version: '1.0.0',
      width: 260,
      height: 260,
      backgroundColor: '#002058',
      pixelArt: true,
      scene: [MainWordScene],
      zoom: 2,
    };

    // ✅ Asignar la instancia de Phaser.Game
    this.game = new Phaser.Game(config);

    // ✅ Esperar a que la escena se inicialice antes de acceder a ella
    this.game.events.once('ready', () => {
      this.mainScene = this.game.scene.getScene('MainWordScene');

      if (this.mainScene) {
        console.log("✅ Escena MainWordScene encontrada");

        // ✅ Pasar datos a la escena
        this.mainScene.data.set('gamesData', this.games);

        // ✅ Escuchar el evento cuando una palabra es encontrada
        this.mainScene.events.on('word-found', (word: string) => {
          console.log(`Palabra encontrada: ${word}`);

          // ✅ Aplicar tachado a la palabra encontrada
          this.markWordAsFound(word);

          // ✅ Incrementar el contador de palabras encontradas
          this.foundWordsCount++;

          // ✅ Si todas las palabras han sido encontradas, mostrar mensaje final
          if (this.foundWordsCount === this.wordsList.length) {
            this.showCompletionMessage();
          }
        });

        // ✅ Despertar la escena para asegurarnos de recibir eventos
        this.mainScene.events.emit('scene-awake');
      } else {
        console.error("❌ No se encontró la escena MainWordScene");
      }
    });
  }

  /** 🔹 Función para marcar una palabra encontrada con un subrayado */
  private markWordAsFound(foundWord: string): void {
    const wordIndex = this.wordsList.findIndex(word => word.english === foundWord);
    if (wordIndex !== -1) {
      const wordElement = document.getElementById(`word-${wordIndex}`);
      if (wordElement) {
        wordElement.style.textDecoration = "line-through"; // Aplicar tachado
      }
    }
  }

  /** 🔹 Función para mostrar mensaje al terminar el juego */
  private async showCompletionMessage(): Promise<void> {
    const confirmed = await this.alertsService.confirm(
      "🎉 ¡Felicidades! Has encontrado todas las palabras.",
      "Juego Completado",
      "Jugar de nuevo",
      "Salir"
    );

    if (confirmed) {
      location.reload(); // Recargar la página para reiniciar el juego
    } else {
      this.goBack(); // Volver al menú
    }
  }

  goBack(): void {
    this.router.navigate(['/modulos/i/games']);
  }
}