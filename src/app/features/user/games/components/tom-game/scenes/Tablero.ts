import Phaser from 'phaser';

export class Tablero extends Phaser.Scene {
  // Índice actual de la casilla en el tablero
  private currentIndex: number = 1;
  // Arreglo que almacena las posiciones del tablero con sus conexiones
  private boardPositions: { id: number; x: number; y: number; connections: number[] }[] = [];
  // Sprite del jugador
  private player!: Phaser.Physics.Arcade.Sprite;
  // Sprite del dado (cuadrado) con tipado correcto
  private square!: Phaser.Physics.Arcade.Sprite;
  // Objeto de texto que muestra el número en el dado
  private numberText!: Phaser.GameObjects.Text;
  // Número actual mostrado en el dado
  private currentNumber: number = 1;
  // Evento de temporizador para actualizar el número del dado
  private timerEvent: any;
  // Callback para hacer que el dado siga al jugador
  private followPlayerCallback!: () => void

  constructor() {
    // Se inicializa la escena con la clave 'Tablero'
    super({ key: 'Tablero' });
  }

  preload() {
    // Configuración de la ruta para cargar assets
    this.load.path = './assets/';
    // Cargar la imagen del mapa
    this.load.image('bitmap', 'bitmap.png');
    // Cargar el atlas y animaciones para el personaje "tom"
    this.load.atlas('tom', 'tom_anim/tom_atlas.png', 'tom_anim/tom_atlas_atlas.json');
    this.load.animation('tomAnim', "tom_anim/tom_atlas_anim.json");
    // Cargar la imagen del dado
    this.load.image('square', 'dado/white.png');
  }

  create(): void {
    console.log('Escena Tablero iniciada');
    // Inicializa la imagen del tablero
    this.tablero();
    // Define las posiciones del tablero (rombo)
    this.defineBoardPositions();
    // Inicializa al personaje "tom"
    this.tom();
    // Crea el dado en una posición inicial
    this.dado(719, 1149);
    // Define el callback para que el dado siga al jugador
    this.followPlayerCallback = () => {
      this.square.setPosition(this.player.x, this.player.y - 139);
    };
    // Asocia el callback al evento 'worldstep' de la física
    this.physics.world.on('worldstep', this.followPlayerCallback);
  }

  dado(x: number, y: number) {
    // Crea el sprite del dado en la posición ajustada
    this.square = this.physics.add.sprite(x, y - 139, 'square');

    // Añade un texto que muestra el número actual en el dado
    this.numberText = this.add.text(this.square.x - 10, this.square.y - 20, this.currentNumber.toString(), {
      fontSize: '40px',
      color: '#000'
    });

    // Crea un evento temporizador que actualiza el número del dado cada 100ms
    this.timerEvent = this.time.addEvent({
      delay: 100,  // Intervalo de 100ms
      callback: () => this.updateNumber(),  // Llama a updateNumber para actualizar el número
      callbackScope: this,  // Asegura que 'this' se refiera a la escena
      loop: true  // Hace que el evento se repita continuamente
    });

    // Actualiza la posición del texto para que siga al dado en cada 'worldstep'
    this.physics.world.on('worldstep', () => {
      this.numberText.setPosition(this.square.x - 10, this.square.y - 20);
    });

    // Detecta colisiones entre el dado y el jugador
    this.physics.add.collider(this.square, this.player, (square, player) => {
      this.onCollision(this.square, this.player);
    });
  }

  updateNumber() {
    // Actualiza el número mostrado en el dado (de 1 a 9 de forma cíclica)
    this.currentNumber = this.currentNumber % 9 + 1;
    this.numberText.setText(this.currentNumber.toString());
  }

  // Función que se ejecuta al detectar una colisión entre el dado y el jugador
  onCollision(square: Phaser.Physics.Arcade.Sprite, player: Phaser.GameObjects.Sprite): void {
    // Detiene el movimiento del dado en ambos ejes
    square.setVelocityX(0);
    square.setVelocityY(0);
    console.log('El cuadrado se detuvo y el número es:', this.currentNumber);

    // Realiza un efecto de "salto" en el dado usando una tween
    this.tweens.add({
      targets: square,
      y: square.y - 20, // Salto de 20 píxeles hacia arriba
      duration: 200, // Duración del salto
      ease: 'Sine.easeOut',
      yoyo: true // Vuelve a la posición original después del salto
    });
    // Pausa el evento del temporizador del dado para detener la actualización del número
    this.timerEvent.paused = true;
  }

  defineBoardPositions() {
    // Agrega las posiciones del tablero con sus conexiones correspondientes
    this.boardPositions.push(
      { id: 1, x: 719, y: 1149, connections: [2] },
      { id: 2, x: 837, y: 1095, connections: [3]  },
      { id: 3, x: 954, y: 1040, connections: [4]  },
      { id: 4, x: 1072, y: 983, connections: [5]  },
      { id: 5, x: 1183, y: 927, connections: [6]  },
      { id: 6, x: 1301, y: 874, connections: [7]  },
      { id: 7, x: 1417, y: 820, connections: [8, 53]  },
      { id: 8, x: 1535, y: 764, connections: [9]  },
      { id: 9, x: 1650, y: 711, connections: [10]  },
      { id: 10, x: 1766, y: 655, connections: [11] },
      { id: 11, x: 1881, y: 598, connections: [12] },
      { id: 12, x: 1997, y: 544, connections: [13] },
      { id: 13, x: 2117, y: 491, connections: [14] },
      { id: 14, x: 2227, y: 541, connections: [15] },
      { id: 15, x: 2344, y: 601, connections: [16] },
      { id: 16, x: 2462, y: 656, connections: [17] },
      { id: 17, x: 2577, y: 710, connections: [18] },
      { id: 18, x: 2694, y: 761, connections: [19] },
      { id: 19, x: 2812, y: 820, connections: [20] },
      { id: 20, x: 2926, y: 874, connections: [21] },
      { id: 21, x: 3042, y: 931, connections: [22, 75] },
      { id: 22, x: 3158, y: 985, connections: [23] },
      { id: 23, x: 3274, y: 1039, connections: [24] },
      { id: 24, x: 3389, y: 1094, connections: [25] },
      { id: 25, x: 3504, y: 1150, connections: [26] },
      { id: 26, x: 3621, y: 1206, connections: [27] },
      { id: 27, x: 3741, y: 1261, connections: [28] },
      { id: 28, x: 3621, y: 1316, connections: [29] },
      { id: 29, x: 3504, y: 1370, connections: [30] },
      { id: 30, x: 3390, y: 1426, connections: [31] },
      { id: 31, x: 3273, y: 1479, connections: [32] },
      { id: 32, x: 3158, y: 1535, connections: [33] },
      { id: 33, x: 3041, y: 1590, connections: [34, 65]  },
      { id: 34, x: 2926, y: 1645, connections: [35] },
      { id: 35, x: 2808, y: 1699, connections: [36] },
      { id: 36, x: 2693, y: 1755, connections: [37] },
      { id: 37, x: 2576, y: 1809, connections: [38] },
      { id: 38, x: 2462, y: 1865, connections: [39] },
      { id: 39, x: 2346, y: 1919, connections: [40] },
      { id: 40, x: 2231, y: 1865, connections: [41] },
      { id: 41, x: 2112, y: 1809, connections: [42] },
      { id: 42, x: 1997, y: 1756, connections: [43] },
      { id: 43, x: 1881, y: 1698, connections: [44] },
      { id: 44, x: 1765, y: 1644, connections: [45] },
      { id: 45, x: 1648, y: 1589, connections: [46] },
      { id: 46, x: 1533, y: 1535, connections: [47] },
      { id: 47, x: 1417, y: 1480, connections: [48] },
      { id: 48, x: 1301, y: 1425, connections: [49] },
      { id: 49, x: 1186, y: 1370, connections: [50] },
      { id: 50, x: 1070, y: 1313, connections: [51] },
      { id: 51, x: 954, y: 1260, connections: [52] },
      { id: 52, x: 837, y: 1205, connections: [1] },
      { id: 53, x: 1534, y: 875, connections: [54]  },
      { id: 54, x: 1650, y: 930, connections: [55]  },
      { id: 55, x: 1765, y: 987, connections: [56]  },
      { id: 56, x: 1880, y: 1038, connections: [57]  },
      { id: 57, x: 1996, y: 1095, connections: [58]  },
      { id: 58, x: 2114, y: 1148, connections: [59]  },
      { id: 59, x: 2227, y: 1204, connections: [60]  },
      { id: 60, x: 2344, y: 1255, connections: [70]  },
      { id: 61, x: 2462, y: 1315, connections: [60]  },
      { id: 62, x: 2577, y: 1366, connections: [61]  },
      { id: 63, x: 2695, y: 1422, connections: [62]  },
      { id: 64, x: 2811, y: 1477, connections: [63]  },
      { id: 65, x: 2928, y: 1532, connections: [64]  },
      { id: 66, x: 1767, y: 1533, connections: [45]  },
      { id: 67, x: 1882, y: 1481, connections: [66]  },
      { id: 68, x: 1999, y: 1425, connections: [67]  },
      { id: 69, x: 2115, y: 1370, connections: [68]  },
      { id: 70, x: 2230, y: 1314, connections: [69]  },
      { id: 71, x: 2463, y: 1204, connections: [72]  },
      { id: 72, x: 2578, y: 1149, connections: [60]  },
      { id: 73, x: 2694, y: 1095, connections: [72]  },
      { id: 74, x: 2808, y: 1040, connections: [73]  },
      { id: 75, x: 2925, y: 983, connections: [74]  }
    );
  }

  tom() {
    // Crea el sprite del jugador "tom" en la posición inicial y configura su escala y profundidad
    this.player = this.physics.add.sprite(719, 1149, 'tom').setOrigin(0.5, 1);
    this.player.setScale(5);
    this.player.setDepth(3);

    // Agrega un listener para la tecla espacio que hará saltar al jugador
    this.input.keyboard!.on('keydown-SPACE', () => {
      console.log('Se presionó la tecla espacio');
      this.jumpPlayer();
    });
  }

  tablero() {
    // Agrega la imagen del mapa como fondo y la posiciona en la esquina superior izquierda
    const map = this.add.image(0, 0, 'bitmap').setOrigin(0, 0);

    // Configura los límites de la cámara según el tamaño del mapa
    this.cameras.main.setBounds(0, 0, map.width * map.scaleX, map.height * map.scaleY);

    // Define el zoom inicial de la cámara
    this.cameras.main.setZoom(0.5);

    // Configura el zoom mediante la rueda del ratón, con un mínimo y máximo definidos
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

    // Permite mover la cámara arrastrando el ratón
    this.input.on('pointermove', (pointer: any) => {
      if (pointer.isDown) {
        this.cameras.main.scrollX -= pointer.velocity.x / this.cameras.main.zoom;
        this.cameras.main.scrollY -= pointer.velocity.y / this.cameras.main.zoom;
      }
    });
  }

  jumpPlayer() {
    // Desactiva temporalmente el seguimiento del dado para permitir el salto sin interferencias
    this.physics.world.off('worldstep', this.followPlayerCallback);
  
    // Crea una tween para simular un salto hacia arriba y luego hacia abajo del jugador
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 50, // Salto de 50 píxeles hacia arriba
      duration: 500,
      ease: 'Sine.easeOut',
      onComplete: () => {
        // Al terminar el salto hacia arriba, se realiza el descenso
        this.tweens.add({
          targets: this.player,
          y: this.player.y + 50, // Regresa a la posición original
          duration: 500,
          ease: 'Sine.easeIn'
        });
        // Después del salto, mueve al jugador según el número actual del dado
        this.movePlayer(this.currentNumber);
      }
    });
  }

  movePlayer(steps: number): void {
    console.log(`Intentando mover ${steps} pasos.`);
    if (steps <= 0) return;

    let remainingSteps = steps;

    // Bucle para mover el jugador por cada paso
    while (remainingSteps > 0) {
        // Busca la posición actual en el tablero
        const currentPos = this.boardPositions.find(pos => pos.id === this.currentIndex);
        if (!currentPos) {
            console.error("Posición actual no encontrada en el tablero.");
            return;
        }

        console.log(`Casilla actual: ${this.currentIndex}, Opciones: ${currentPos.connections}`);

        // Si sólo hay una conexión, avanza automáticamente
        if (currentPos.connections.length === 1) {
            this.currentIndex = currentPos.connections[0];
        } else {
            // Si hay más de una opción, se muestra al usuario para elegir la dirección
            console.log(`Intersección en la casilla ${this.currentIndex}. Elige una dirección.`);
            this.showDirectionOptions(currentPos.connections, remainingSteps);
            return;
        }

        remainingSteps--;
    }

    // Una vez calculados los pasos, se anima el movimiento del jugador a la casilla destino
    this.animatePlayerTo(this.currentIndex);
  }

  animatePlayerTo(targetId: number): void {
    // Busca la nueva posición a la que se moverá el jugador
    const newPos = this.boardPositions.find(pos => pos.id === targetId);
    if (!newPos) {
      console.error(`No se encontró la casilla con id ${targetId}.`);
      return;
    }
  
    console.log(`Moviendo a la casilla ${targetId} en posición (${newPos.x}, ${newPos.y}).`);
  
    // Decide la dirección del sprite del jugador según el rango de casilla
    if ((targetId >= 1 && targetId <= 27) || (targetId >= 53 && targetId <= 60)) {
      this.player.setFlipX(false);
    } else {
      this.player.setFlipX(true);
    }
  
    // Reproduce la animación de caminar
    this.player.play('caminar_derecha', true);
  
    // Crea una tween para animar el movimiento del jugador hacia la nueva posición
    this.tweens.add({
      targets: this.player,
      x: newPos.x,
      y: newPos.y,
      duration: (1000 * this.currentNumber), // La duración depende del número actual del dado
      ease: 'Sine',
      onUpdate: () => {
        // Asegura que la posición de origen del jugador se mantenga correcta durante la animación
        this.player.setOrigin(0.5, 1);
      },
      onComplete: () => {
        // Al finalizar la animación, se detiene el sprite y se reestablece su posición
        this.player.stop();
        this.player.setFrame('frente').setOrigin(0.5, 1);
        
        // Reactiva el temporizador del dado para la siguiente jugada
        this.timerEvent.paused = false;
        
        // Vuelve a activar el seguimiento del dado
        this.physics.world.on('worldstep', this.followPlayerCallback);
      }
    });
  
    // Actualiza el índice de la casilla actual
    this.currentIndex = targetId;
  }
  
  showDirectionOptions(options: number[], remainingSteps: number): void {
    // Muestra en la consola las opciones de conexión disponibles
    console.log("Opciones disponibles:", options);

    // Grupo para manejar los botones de dirección
    const buttonGroup = this.add.group();

    // Crea un botón interactivo para cada opción de dirección
    options.forEach((optionId, index) => {
        // Obtiene la posición destino para cada opción
        const newPos = this.boardPositions.find(pos => pos.id === optionId);
        if (!newPos) return;

        // Crea un botón gráfico en la posición del destino con un número indicativo
        const button = this.add.text(newPos.x, newPos.y, `${index + 1}`, {
            fontSize: '32px',
            backgroundColor: '#f00',
            color: '#fff',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();

        // Al hacer clic en el botón, se mueve el jugador a la opción seleccionada
        button.on('pointerdown', () => {
            this.currentIndex = optionId;
            this.animatePlayerTo(this.currentIndex);
            // Elimina todos los botones después de la elección
            buttonGroup.clear(true, true);

            // Si quedan más pasos, se llama recursivamente para continuar el movimiento
            if (remainingSteps > 1) {
                this.time.delayedCall(600, () => {
                    this.movePlayer(remainingSteps - 1);
                });
            }
        });

        // Agrega el botón al grupo
        buttonGroup.add(button);
    });
  }
}
