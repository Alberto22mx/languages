export enum GameType {
  WORDSEARCH = 'WordSearch'
}

export interface Games {
  id: string;
  title: string;
  instructions: string;
  active: string;
  image: string;
  url: string;
  data?: any[];
  type: GameType;
}
