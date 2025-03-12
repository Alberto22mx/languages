import Phaser from 'phaser';

export class MainWordScene extends Phaser.Scene {
    private gridSize: number = 10; // 10 x 10
    private words: string[] = ["APPLE", "BANANA", "ORANGE", "GRAPE", "LEMON"];
    private puzzle: string[][] = [];
    private textGrid: Phaser.GameObjects.Text[][] = [];
    private foundWords: Set<string> = new Set();
  
    // Margen y tamaño de celda configurables
    private offsetX: number = 10;
    private offsetY: number = 10;
    private cellSize: number = 24;
  
    // Para manejo de selección
    private startCell: { row: number; col: number } | null = null;
    private tempHighlightRects: Phaser.GameObjects.Rectangle[] = [];
    private permanentHighlightRects: Phaser.GameObjects.Rectangle[] = [];
  
    // Direcciones posibles (horizontal, vertical y diagonales)
    private directions = [
      [0, 1], [0, -1],
      [1, 0], [-1, 0],
      [1, 1], [1, -1],
      [-1, 1], [-1, -1],
    ];
  
    constructor() {
      super({ key: 'MainWordScene' });
    }
  
    create(): void {
      // Generar puzzle y crear letras en pantalla
      this.puzzle = this.createPuzzle(this.gridSize, this.words);
      this.createTextGrid();
  
      // Eventos de puntero
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const cell = this.getCellFromPointer(pointer);
        if (cell) {
          this.startCell = cell;
        }
      });
  
      this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        if (this.startCell && pointer.isDown) {
          this.clearTempHighlights();
          const currentCell = this.getCellFromPointer(pointer);
          if (currentCell) {
            const cellsInLine = this.getLineCells(this.startCell, currentCell);
            if (cellsInLine.length > 0) {
              this.tempHighlightRects = this.highlightCells(cellsInLine, 0xff0000, 0.3);
            }
          }
        }
      });
  
      this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        if (this.startCell) {
          const endCell = this.getCellFromPointer(pointer);
          if (endCell) {
            const cellsInLine = this.getLineCells(this.startCell, endCell);
            if (cellsInLine.length > 0) {
              const selectedWord = cellsInLine
                .map(cell => this.puzzle[cell.row][cell.col])
                .join('');
              const reversed = selectedWord.split('').reverse().join('');
              if (this.words.includes(selectedWord) || this.words.includes(reversed)) {
                // Resaltado permanente (verde)
                const permanentRects = this.highlightCells(cellsInLine, 0x00ff00, 0.5);
                this.permanentHighlightRects.push(...permanentRects);
                this.foundWords.add(selectedWord);
                console.log("Word found:", selectedWord);
                // Aquí puedes llamar a tu servicio para guardar progreso
              }
            }
          }
        }
        this.clearTempHighlights();
        this.startCell = null;
      });
    }
  
    // Generar el puzzle y colocar palabras aleatoriamente
    private createPuzzle(size: number, words: string[]): string[][] {
      const grid: string[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => '')
      );
      for (const word of words) {
        this.placeWord(grid, word.toUpperCase());
      }
      // Rellenar huecos con letras aleatorias
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === '') {
            grid[r][c] = this.randomLetter();
          }
        }
      }
      return grid;
    }
  
    // Colocar una palabra en una posición/dirección aleatoria, si cabe
    private placeWord(grid: string[][], word: string): void {
      const maxAttempts = 100;
      let placed = false;
      const size = grid.length;
      for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        const [dRow, dCol] = this.directions[Phaser.Math.Between(0, this.directions.length - 1)];
        const startRow = Phaser.Math.Between(0, size - 1);
        const startCol = Phaser.Math.Between(0, size - 1);
        if (this.fits(grid, word, startRow, startCol, dRow, dCol)) {
          for (let i = 0; i < word.length; i++) {
            const r = startRow + i * dRow;
            const c = startCol + i * dCol;
            grid[r][c] = word[i];
          }
          placed = true;
        }
      }
    }
  
    // Verificar si la palabra cabe en la posición y dirección indicadas
    private fits(
      grid: string[][],
      word: string,
      startRow: number,
      startCol: number,
      dRow: number,
      dCol: number
    ): boolean {
      const size = grid.length;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + i * dRow;
        const c = startCol + i * dCol;
        if (r < 0 || r >= size || c < 0 || c >= size) return false;
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
      }
      return true;
    }
  
    // Retorna una letra aleatoria de A-Z
    private randomLetter(): string {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return letters.charAt(Phaser.Math.Between(0, letters.length - 1));
    }
  
    // Colocar las letras centradas en cada celda y guardarlas en textGrid
    private createTextGrid(): void {
      for (let r = 0; r < this.gridSize; r++) {
        this.textGrid[r] = [];
        for (let c = 0; c < this.gridSize; c++) {
          const letter = this.puzzle[r][c];
  
          // Centro de la celda
          const centerX = this.offsetX + c * this.cellSize + this.cellSize / 2;
          const centerY = this.offsetY + r * this.cellSize + this.cellSize / 2;
  
          // Crear texto centrado
          const textObj = this.add.text(centerX, centerY, letter, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
          });
          textObj.setOrigin(0.5);
  
          this.textGrid[r][c] = textObj;
        }
      }
    }
  
    // Calcula la celda (row, col) basándose en la posición del puntero
    private getCellFromPointer(pointer: Phaser.Input.Pointer): { row: number; col: number } | null {
      // Se descuenta el offset y se divide por el tamaño de celda
      const col = Math.floor((pointer.x - this.offsetX) / this.cellSize);
      const row = Math.floor((pointer.y - this.offsetY) / this.cellSize);
  
      if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
        return { row, col };
      }
      return null;
    }
  
    // Retorna las celdas en línea recta (horizontal, vertical o diagonal) desde start hasta end
    private getLineCells(
      start: { row: number; col: number },
      end: { row: number; col: number }
    ): { row: number; col: number }[] {
      const dRow = end.row - start.row;
      const dCol = end.col - start.col;
      const absRow = Math.abs(dRow);
      const absCol = Math.abs(dCol);
  
      // Solo se aceptan líneas rectas
      if (!(dRow === 0 || dCol === 0 || absRow === absCol)) {
        return [];
      }
  
      const stepRow = Math.sign(dRow);
      const stepCol = Math.sign(dCol);
      const cells = [];
      let r = start.row;
      let c = start.col;
      while (true) {
        cells.push({ row: r, col: c });
        if (r === end.row && c === end.col) break;
        r += stepRow;
        c += stepCol;
      }
      return cells;
    }
  
    // Resalta las celdas pasadas dibujando rectángulos del tamaño exacto de la celda
    private highlightCells(
      cells: { row: number; col: number }[],
      color: number,
      alpha: number
    ): Phaser.GameObjects.Rectangle[] {
      const rects: Phaser.GameObjects.Rectangle[] = [];
      cells.forEach(cell => {
        // Centro de la celda
        const centerX = this.offsetX + cell.col * this.cellSize + this.cellSize / 2;
        const centerY = this.offsetY + cell.row * this.cellSize + this.cellSize / 2;
  
        // Dibujamos un rectángulo con el tamaño de la celda, no el tamaño del texto
        const rect = this.add.rectangle(centerX, centerY, this.cellSize, this.cellSize, color, alpha);
        rect.setOrigin(0.5);
        rect.setDepth(1);
        rects.push(rect);
      });
      return rects;
    }
  
    // Elimina y destruye los rectángulos temporales
    private clearTempHighlights(): void {
      this.tempHighlightRects.forEach(rect => rect.destroy());
      this.tempHighlightRects = [];
    }
}