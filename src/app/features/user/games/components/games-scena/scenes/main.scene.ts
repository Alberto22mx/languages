
import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  cubix_fondo: any;
  cubix: any;
  teclaA: any;
  teclas: any;
  cursor: any;
  drop: any;
  tuki: any;

  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    console.log('INIT')
  }

  preload() {
    this.load.path = './assets/animate/';
    // Carga el spritesheet con la clave 'tuki_tex'
    this.load.spritesheet('tuki_tex', 'tuki_tex.png', {
      frameWidth: 800, // Tamaño de cada cuadro
      frameHeight: 450 // Tamaño de cada cuadro
    });
  }

  create(): void {
    // Crear una animación para el spritesheet
    this.tuki = this.add.sprite(100, 100, 'tuki_tex').setScale(0.2);
  }

  preload2() {
    this.load.path = './assets/animate/';
    const images = 'tuki_tex';
    // this.load.image(images, `${images}.png`);
    this.load.spritesheet(images, `${images}.png`, {
      frameWidth: 106,
      frameHeight: 106
    });
    // const images = ['cubix', 'cubix_fondo', 'drop'];
    // images.forEach(imageName => {
    //   this.load.image(imageName, `${imageName}.png`);
    // });
    // this.load.image(['cubix', 'cubix_fondo']);
    // this.load.image('drop', 'drop.png');
    // this.load.path = 'assets/cubix/';
    // const images = ['cubix', 'cubix_fondo'];
    // images.forEach(imageName => {
    //   this.load.image(imageName, `${imageName}.png`);
    // });
  }

  create2(): void {
    console.log('create');
    this.tuki = this.add.sprite(100, 100, 'tuki_tex');
  

    // this.input.on(eventos.DRAG_ENTER, (pointer, obj, dropzone) => {
    //     dropzone.setTint(0xff0000);
    // });
    // this.input.on(eventos.DRAG_LEAVE, (pointer, obj, dropzone) => {
    //     dropzone.clearTint();
    // });
    // this.input.on(eventos.DROP, (pointer, obj, dropzone) => {
    //     obj.x = dropzone.x;
    //     obj.y = dropzone.y;
    // });
    // this.cubix_fondo = this.add.image(100, 100, 'cubix_fondo');
    // this.cubix = this.add.image(200, 100, 'cubix');
    // this.cursor = this.input.keyboard?.createCursorKeys();
    // const eventos = Phaser.Input.Events;
    //     this.input.on(eventos.POINTER_DOWN, (evento: any) => {
    //         console.log("Se ha clicado en el CANVAS");
    //         console.log(evento);
    //     });
    // Control de teclado
    // const keyCodes = Phaser.Input.Keyboard.KeyCodes;
    // this.teclaA = this.input.keyboard?.addKey(keyCodes.A);
    // console.log(keyCodes);
    // Eventos down, up, isDown
    // this.teclaA.on('down', () => {
    //   console.log('A');
    // });
    // Pibote de la imagen
    // this.cubix.setOrigin(0.5, 0.5);
    // Incisibiliza
    // this.cubix.setVisible(0);
    // Gira la imagen en X o Y
    // this.cubix.flipY = true;
    // Escala la imagen
    // this.cubix.setScale(2);
    // Cisible
    // this.cubix.setAlpha(0.5);
    // Cambia el color
    // this.cubix.setTint(0xff000);
    // Pisicion
    // this.cubix.x = 200;
    // z-index
    // this.cubix.setDepth(1);

    // Uso de las teclas con objetos
    // this.teclas = this.input.keyboard?.addKeys({
    //     arriba: keyCodes.UP,
    //     abajo: keyCodes.DOWN,
    //     s: keyCodes.S
    // });
    // this.teclas.s.on('down', () => {
    //     console.log('Se ha presionado la S');
    // });
    // this.teclas.arriba.on('down', () => {
    //     console.log('Se ha presionado la ARRIBA');
    // });
    // this.teclas.abajo.on('down', () => {
    //     console.log('Se ha presionado la ABAJO');
    // });
    // this.teclas = this.input.keyboard.addKeys('d,f,UP,DOWN,LEFT,RIGHT');
    // this.teclas.LEFT.on('down', () => {
    //     console.log('Has presionado la tecla LEFT');
    // });
    // this.teclas.f.on('down', () => {
    //     console.log('Has presionado la tecla F');
    // });
    // this.input.keyboard.on('keydown', (evento) => {
    //     if(evento.key === 'e') {
    //         console.log('Se ha tocado la siguiente tecla ', evento);
    //     }
    // });
    // this.cursor = this.input.keyboard.createCursorKeys();
    // this.cursor.left.on('down', () => {
    //     console.log('Se ha clicado el left');
    // });
    // this.cursor.right.on('down', () => {
    //     console.log('Se ha clicado el right');
    // });
  }

  override update(time: number, delta: number): void {
      // if(this.cursor.left.isDown) {
      //     console.log('Se ha presionado la left');
      // }
      // if(this.teclas.arriba.isDown) {
      //     console.log('Se ha presionado la ARRIBA');
      // }
      // if(Phaser.Input.Keyboard.JustDown(this.teclaA)) {
      //     console.log('Has presionado la tecla A');
      // }

      // if(this.teclaA.isDown) {
      //     console.log('Has presionado la tecla A');
      // } else if(this.teclaA.isUp) {
      //     console.log('Has soltado la tecla A');
      // } 
  }
}