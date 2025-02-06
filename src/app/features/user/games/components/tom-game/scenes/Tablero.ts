import Phaser from 'phaser';

export class Tablero extends Phaser.Scene {
  private currentIndex: number = 0;
  private boardPositions: { x: number; y: number }[] = [];
  private player!: Phaser.GameObjects.Sprite; // Referencia directa al jugador

  constructor() {
    super({ key: 'Tablero' });
  }

  preload() {
    this.load.path = './assets/';
    // Cargar la imagen del jugador y el mapa
    this.load.image('tomato_item', 'tom/tomato_item.png');
    this.load.image('bitmap', 'bitmap.png');
  }

  create(): void {
    console.log('Escena Tablero iniciada');
    this.tablero();
    this.defineBoardPositions(); // Definir las posiciones del rombo
    this.tom();
  }

  defineBoardPositions() {
    // Posición inicial del rombo
    const startX = 675;
    const startY = 1085;

    // Incrementos por paso
    const stepX = 130; // Incremento de X por cada espacio (200 píxeles distribuidos en 12 pasos)
    const stepY = 40;  // Incremento de Y por cada espacio (50 píxeles distribuidos en 12 pasos)

    // Inicializar las posiciones
    this.boardPositions = [];

    // Segmento 1: Diagonal hacia arriba y derecha
    for (let i = 0; i < 12; i++) {
      this.boardPositions.push({
        x: startX + i * stepX,
        y: startY - i * stepY,
      });
    }

    // Segmento 2: Diagonal hacia abajo y derecha
    for (let i = 0; i < 12; i++) {
      this.boardPositions.push({
        x: startX + 12 * stepX + i * stepX,
        y: startY - 12 * stepY + i * stepY,
      });
    }

    // Segmento 3: Diagonal hacia abajo y izquierda
    for (let i = 0; i < 12; i++) {
      this.boardPositions.push({
        x: startX + 12 * stepX - i * stepX,
        y: startY + i * stepY,
      });
    }

    // Segmento 4: Diagonal hacia arriba y izquierda
    for (let i = 0; i < 12; i++) {
      this.boardPositions.push({
        x: startX - i * stepX,
        y: startY + 12 * stepY - i * stepY,
      });
    }

    // Agregar la posición inicial al final para cerrar el rombo
    this.boardPositions.push({ x: startX, y: startY });
  }

  tom() {
    // Crear el jugador en la posición inicial (casilla 0)
    this.player = this.add.sprite(this.boardPositions[0].x, this.boardPositions[0].y, 'tomato_item');
    this.player.setOrigin(0);
    this.player.setScale(5);
    this.player.setDepth(3);

    // Listener para la tecla espacio
    this.input.keyboard!.on('keydown-SPACE', () => {
      console.log('Se presionó la tecla espacio');
      const steps = 1; // Avanzar siempre 1 casilla
      this.movePlayer(steps);
    });
  }

  tablero() {
    // Agregar la imagen del mapa
    const map = this.add.image(0, 0, 'bitmap').setOrigin(0, 0);

    // Configurar los límites del mundo del juego
    this.cameras.main.setBounds(0, 0, map.width * map.scaleX, map.height * map.scaleY);

    // Configurar el zoom inicial
    this.cameras.main.setZoom(0.5);

    // Configurar navegación y zoom
    const minZoom = 0.3;
    const maxZoom = 2;
    this.input.on('wheel', (_: any, __: any, ___: any, deltaY: any) => {
      const currentZoom = this.cameras.main.zoom;
      if (deltaY > 0) {
        this.cameras.main.setZoom(Math.max(minZoom, currentZoom - 0.1));
      } else {
        this.cameras.main.setZoom(Math.min(maxZoom, currentZoom + 0.1));
      }
    });

    // Permitir navegación con arrastre del ratón
    this.input.on('pointermove', (pointer: any) => {
      if (pointer.isDown) {
        this.cameras.main.scrollX -= pointer.velocity.x / this.cameras.main.zoom;
        this.cameras.main.scrollY -= pointer.velocity.y / this.cameras.main.zoom;
      }
    });
  }

  movePlayer(steps: number): void {
    const newIndex = (this.currentIndex + steps) % this.boardPositions.length; // Ciclo continuo en el rombo

    this.currentIndex = newIndex;
    const newPos = this.boardPositions[this.currentIndex];
    console.log(`Moviendo a la casilla ${this.currentIndex} en posición (${newPos.x}, ${newPos.y})`);

    // Animar el movimiento con un tween
    this.tweens.add({
      targets: this.player,
      x: newPos.x,
      y: newPos.y,
      duration: 500,
      ease: 'Power2',
    });
  }
}