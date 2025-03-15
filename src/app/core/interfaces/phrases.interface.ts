export interface Phrase {
    text: string;
    type: 'multiple' | 'free';
    options?: string[]; // Opciones para selección múltiple
    correctAnswer?: string; // Respuesta correcta si es de opción múltiple
    userAnswer?: string; // Respuesta del usuario
  }