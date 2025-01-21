import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lessons } from '../../interfaces/lessons.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private readonly baseUrl = environment.baseUrl + '/lessons';

  constructor(private http: HttpClient) {}

  // Obtener todas las lecciones
  findAll(): Observable<Lessons[]> {
    return this.http.get<Lessons[]>(this.baseUrl);
  }

  // Obtener una lección por ID
  findOne(id: string): Observable<Lessons> {
    return this.http.get<Lessons>(`${this.baseUrl}/${id}`);
  }

  //
  findByIds(ids: string[]): Observable<Lessons> {
    return this.http.post<Lessons>(`${this.baseUrl}/find-many`, {ids});
  }

  // Crear una nueva lección
  create(createLessonDto: Lessons): Observable<Lessons> {
    return this.http.post<Lessons>(this.baseUrl, createLessonDto);
  }

  // Actualizar una lección
  update(id: string, updateLessonDto: Lessons): Observable<Lessons> {
    return this.http.patch<Lessons>(`${this.baseUrl}/${id}`, updateLessonDto);
  }

  // Eliminar una lección
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
