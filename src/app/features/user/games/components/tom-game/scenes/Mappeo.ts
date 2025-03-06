import Phaser from 'phaser';

export class Mappeo extends Phaser.Scene {
    private clickedPositions : { id: number; x: number; y: number }[] = [];
    cursors: any;
    contador: number = 1;

    constructor() {
        super({ key: 'Mappeo' });
    }

    preload() {
        this.load.path = './assets/';
        // Cargar la imagen del jugador y el mapa
        this.load.image('bitmap', 'bitmap.png');
    }
    
    create(): void {
        console.log('Escena Tablero iniciada');
        this.tablero();
        this.defineBoardPositions(); // Definir las posiciones del rombo
        // Crear un botón para descargar el JSON
        this.add.text(50, 50, 'Descargar JSON', { fontSize: '20px', color: '#fff' })
    .setInteractive()
    .on('pointerdown', () => this.downloadJS());

    }
    
    defineBoardPositions() {
        // Inicializar contador de IDs si no existe
        if (this.contador === undefined) {
            this.contador = 1;
        }
    
        // Escuchar clics en el juego
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Obtener coordenadas del clic
            const x = Math.floor(pointer.worldX);
            const y = Math.floor(pointer.worldY);
    
            // Crear el objeto con ID único
            const newPosition = { id: this.contador, x, y };
    
            // Guardar en el array
            this.clickedPositions.push(newPosition);
    
            // Mostrar en consola
            console.log(`Coordenada registrada: { id: ${newPosition.id}, x: ${newPosition.x}, y: ${newPosition.y} }`);
            console.log('Todas las coordenadas:', this.clickedPositions);
    
            // Dibujar un punto visual en la posición clicada (Opcional)
            this.add.circle(x, y, 5, 0xff0000);
            
            // Aumentar el contador
            this.contador++;
        });
    }    
    
    tablero() {
        // Agregar la imagen del mapa
        const map = this.add.image(0, 0, 'bitmap').setOrigin(0, 0);
        
        // Habilitar controles del teclado para moverse
        this.cursors = this.input.keyboard!.createCursorKeys();
    
        // Configurar la cámara
        this.cameras.main.setBounds(0, 0, 4000, 4000); // Ajusta según el tamaño de tu mapa
        this.cameras.main.setZoom(1); // Zoom inicial
    
        // Detectar la rueda del mouse para hacer zoom
        this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: any, deltaY: any) => {
            if (deltaY > 0) {
                // Scroll hacia abajo (Alejar zoom)
                this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - 0.1, 0.5, 2);
            } else {
                // Scroll hacia arriba (Acercar zoom)
                this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + 0.1, 0.5, 2);
            }
        });
        
    }

    override update(time: number, delta: number): void {
        // Velocidad de movimiento de la cámara
        const cameraSpeed = 10;

        if (this.cursors.left.isDown) {
            this.cameras.main.scrollX -= cameraSpeed;
        }
        if (this.cursors.right.isDown) {
            this.cameras.main.scrollX += cameraSpeed;
        }
        if (this.cursors.up.isDown) {
            this.cameras.main.scrollY -= cameraSpeed;
        }
        if (this.cursors.down.isDown) {
            this.cameras.main.scrollY += cameraSpeed;
        }
    }

    downloadJS() {
        // Convertimos el array a un formato de código JavaScript válido
        const jsData = `const boardPositions = [\n` +
            this.clickedPositions.map(p => `  { id: ${p.id}, x: ${p.x}, y: ${p.y} }`).join(',\n') +
            `\n];`;
    
        const blob = new Blob([jsData], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coordenadas.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    
        URL.revokeObjectURL(url);
    }    
    
}