import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupAllData } from '../../interfaces/groups.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private apiUrl = environment.baseUrl + '/groups';

  constructor(private http: HttpClient) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroup(userId: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${userId}`);
  }

  getGroupWithRelations(id: string): Observable<GroupAllData[]> {
    return this.http.get<GroupAllData[]>(`${this.apiUrl}/group-relation/${id}`);
  }

  getTeacherStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teacher/students`);
  }

  getActiveStudentIds(groupId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${groupId}/students`);
  }

  completeStudent(groupId: string, studentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${groupId}/students/${studentId}/complete`, {});
  }

  withdrawStudent(groupId: string, studentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${groupId}/students/${studentId}/withdraw`, {});
  }

  createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group);
  }

  updateGroup(id: string, group: Group): Observable<Group> {
    return this.http.patch<Group>(`${this.apiUrl}/${id}`, group);
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
