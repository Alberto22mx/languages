export interface Exams {
  id?: string;
  title?: string;
  instructions?: string;
  active?: boolean;
  image?: string;
  questions?: any[];
  availableUntil?: string;
  maxAttempts?: number;
}
