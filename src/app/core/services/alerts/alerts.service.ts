import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  // Alerta de éxito
  success(message: string, title: string = '¡Éxito!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }

  // Alerta de error
  error(message: string, title: string = '¡Error!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  // Alerta de advertencia
  warning(message: string, title: string = 'Advertencia') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  }

  // Confirmación personalizada
  confirm(
    message: string,
    title: string = '¿Estás seguro?',
    confirmButtonText: string = 'Sí',
    cancelButtonText: string = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    }).then((result) => result.isConfirmed); // Retorna true si el usuario confirma
  }
}
