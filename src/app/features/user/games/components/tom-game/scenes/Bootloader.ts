import Phaser from 'phaser';

export class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Bootloader' });
  }

  preload() {
    this.load.path = './assets/tom/';
    const images = ['background', 'floor', 'wall', 'tomato_item'];
    images.forEach(imageName => {
      this.load.image(imageName, `${imageName}.png`);
    });
  }

  create(): void {
    // Fondo
    const background = this.add.sprite(0, 0, 'background').setOrigin(0).setScale(1);
    background.displayWidth = this.scale.width;
    background.displayHeight = this.scale.height;

    // Piso (física estática)
    const floor = this.physics.add.staticSprite(0, this.scale.height - 50, 'floor').setOrigin(0);
    floor.displayWidth = this.scale.width;
    floor.refreshBody();

    // Pared izquierda (física estática)
    const leftWall = this.physics.add.staticSprite(0, 0, 'wall').setOrigin(0);
    leftWall.displayHeight = this.scale.height;
    leftWall.refreshBody();

    // Pared derecha (física estática)
    const rightWall = this.physics.add.staticSprite(this.scale.width - 20, 0, 'wall').setOrigin(0);
    rightWall.displayHeight = this.scale.height;
    rightWall.setFlipX(true);
    rightWall.refreshBody();

    // Personaje (física dinámica pero sin gravedad)
    const playerLibre = this.physics.add.sprite(100, 100, 'tomato_item');
    playerLibre.body.setAllowGravity(false); // Desactiva la gravedad para este sprite
    // playerLibre.setCollideWorldBounds(true);

    // Si deseas que tenga un pequeño rebote o alguna propiedad extra, puedes configurarlo aquí
    // playerLibre.setBounce(0.2); // Opcional

    // Configurar colisiones (si es necesario para otros objetos)
    // Por ejemplo, si quieres que colisione con los límites:
    this.physics.add.collider(playerLibre, floor);
    this.physics.add.collider(playerLibre, leftWall);
    this.physics.add.collider(playerLibre, rightWall);

    // Almacenar referencias en `this.data`
    this.data.set({
      background: background,
      floor: floor,
      leftWall: leftWall,
      rightWall: rightWall,
      playerLibre: playerLibre,
    });
  }

  override update(time: number, delta: number): void {
    // Acceso a los objetos almacenados en `this.data`
    const playerLibre = this.data.get('playerLibre');

    // Movimiento simple utilizando las flechas del teclado
    const cursors = this.input.keyboard!.createCursorKeys();

    if (cursors.left.isDown) {
      playerLibre.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      playerLibre.setVelocityX(160);
    } else {
      playerLibre.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      playerLibre.setVelocityY(-160);
    } else if (cursors.down.isDown) {
      playerLibre.setVelocityY(160);
    } else {
      playerLibre.setVelocityY(0);
    }
  }
}
