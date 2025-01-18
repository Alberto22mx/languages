import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {
  private currentZoomClass = 'zoom-100'; // Clase inicial

  setZoom(className: string) {
    // Elimina la clase actual del <body>
    document.body.classList.remove(this.currentZoomClass);
    // Agrega la nueva clase al <body>
    document.body.classList.add(className);
    // Actualiza la clase actual
    this.currentZoomClass = className;
  }

  getZoom(): string {
    return this.currentZoomClass;
  }
}
