import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lessons } from '../../interfaces/lessons.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

  findForTeacher(): Observable<Lessons[]> {
    return this.http.get<Lessons[]>(`${this.baseUrl}/teacher`);
  }

  //
  findByIds(ids: Array<string | Pick<Lessons, 'id'>>): Observable<Lessons[]> {
    const lessonIds = ids
      .map((lesson) => typeof lesson === 'string' ? lesson : lesson?.id)
      .filter((id): id is string => typeof id === 'string' && id.trim().length > 0);

    return this.http.post<Lessons[]>(`${this.baseUrl}/find-many`, { ids: lessonIds });
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
