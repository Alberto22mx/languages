import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exams } from '../../interfaces/exams.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {
  private readonly baseUrl = environment.baseUrl + '/exam';

  constructor(private http: HttpClient) {}

  // Obtener todos los exámenes
  findAll(): Observable<Exams[]> {
    return this.http.get<Exams[]>(this.baseUrl);
  }

  // Obtener un examen por ID
  findOne(id: string): Observable<Exams> {
    return this.http.get<Exams>(`${this.baseUrl}/${id}`);
  }

  findByIds(ids: string[]): Observable<Exams[]> {
    return this.http.post<Exams[]>(`${this.baseUrl}/find-many`, {ids});
  }

  // Crear un nuevo examen
  create(createExamDto: Exams): Observable<Exams> {
    return this.http.post<Exams>(this.baseUrl, createExamDto);
  }

  // Actualizar un examen
  update(id: string, updateExamDto: any): Observable<Exams> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, updateExamDto);
  }

  // Eliminar un examen
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
