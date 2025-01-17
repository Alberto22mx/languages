import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Games } from '../../interfaces/games.interface';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private readonly baseUrl = environment.baseUrl + '/games';

  constructor(private http: HttpClient) {}

  // Obtener todos los juegos
  findAll(): Observable<Games[]> {
    return this.http.get<Games[]>(this.baseUrl);
  }

  // Obtener un juego por ID
  findOne(id: string): Observable<Games> {
    return this.http.get<Games>(`${this.baseUrl}/${id}`);
  }

  // Crear un nuevo juego
  create(createGameDto: Games): Observable<Games> {
    return this.http.post<Games>(this.baseUrl, createGameDto);
  }

  // Actualizar un juego
  update(id: string, updateGameDto: Games): Observable<Games> {
    return this.http.patch<Games>(`${this.baseUrl}/${id}`, updateGameDto);
  }

  // Eliminar un juego
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
