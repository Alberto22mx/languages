import Phaser from 'phaser';

export class Tablero extends Phaser.Scene {
  private currentIndex: number = 0;
  private boardPositions: { x: number; y: number }[] = [];
  private player!: Phaser.GameObjects.Sprite; // Referencia directa al jugador
  
  constructor() {
    super({ key: 'Tablero' });
  }

  preload() {
    this.load.path = './assets/tom/';
    // Cargar la imagen del jugador
    this.load.image('tomato_item', 'tomato_item.png');
  }

  create(): void {
    console.log('Escena Tablero iniciada');

    // Definir las posiciones de cada casilla del tablero (mitad de las posiciones originales)
    // Originalmente: { x: 50, y: 450 }, { x: 150, y: 450 }, { x: 250, y: 450 }, { x: 350, y: 450 }
    // Ahora se usan valores reducidos a la mitad
    this.boardPositions = [
      { x: 25, y: 225 },
      { x: 75, y: 225 },
      { x: 125, y: 225 },
      { x: 175, y: 225 },
      { x: 200, y: 250 },
      { x: 225, y: 275 },
    ];

    // Crear el jugador en la posición inicial (casilla 0)
    this.player = this.add.sprite(this.boardPositions[0].x, this.boardPositions[0].y, 'tomato_item');
    this.player.setOrigin(0.5);
    // Escalar el sprite a la mitad para que se vea acorde al tamaño reducido del tablero
    this.player.setScale(0.5);
    
    // Listener para la tecla espacio
    this.input.keyboard!.on('keydown-SPACE', () => {
      console.log('Se presionó la tecla espacio');
      // Simular un dado que retorna un número entre 1 y 3
      const steps = Phaser.Math.Between(1, 3);
      console.log(`Avanzar ${steps} casilla(s)`);
      this.movePlayer(steps);
    });
  }

  movePlayer(steps: number): void {
    const newIndex = this.currentIndex + steps;

    if (newIndex < this.boardPositions.length) {
      this.currentIndex = newIndex;
      const newPos = this.boardPositions[this.currentIndex];
      console.log(`Moviendo a la casilla ${this.currentIndex} en posición (${newPos.x}, ${newPos.y})`);

      // Animar el movimiento con un tween para hacerlo más fluido
      this.tweens.add({
        targets: this.player,
        x: newPos.x,
        y: newPos.y,
        duration: 500,
        ease: 'Power2'
      });
    } else {
      console.log('¡Has alcanzado o superado el final del tablero!');
      // Aquí podrías reiniciar el juego o implementar otra lógica
    }
  }
}
