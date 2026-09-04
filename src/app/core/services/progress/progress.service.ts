import { Injectable } from '@angular/core';
import { Progress } from '../../interfaces/progress.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly API_URL = environment.baseUrl + '/progress'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  // Crear un nuevo progreso
  createProgress(progress: Progress): Observable<Progress> {
    return this.http.post<Progress>(this.API_URL, progress);
  }

  // Obtener todos los progresos
  getAllProgress(): Observable<Progress[]> {
    return this.http.get<Progress[]>(this.API_URL);
  }

  // Obtener un progreso por ID
  getProgressById(id: string): Observable<Progress> {
    return this.http.get<Progress>(`${this.API_URL}/${id}`);
  }

  // Actualizar un progreso
  updateProgress(id: string, progress: Partial<Progress>): Observable<Progress> {
    return this.http.put<Progress>(`${this.API_URL}/${id}`, progress);
  }

  getExamResults(groupId: string, examId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/exam-results/${groupId}/${examId}`);
  }

  getMyExamStatus(examId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/exam-status/${examId}`);
  }

  getStudentExamResults(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/student-exam-results/${studentId}`);
  }

  gradeExamSubmission(id: string, answers: any[], feedback?: string): Observable<Progress> {
    return this.http.put<Progress>(`${this.API_URL}/${id}/grade`, { answers, feedback });
  }

  // Eliminar un progreso
  deleteProgress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
