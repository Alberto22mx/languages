import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseUrl + '/auth';
  private token: string | null = null;
  private userType: string | null = null;
  private userId: string | null = null;
  // BehaviorSubject para manejar el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(registrationNumber: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { registrationNumber, password });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  setAuthData(response: { accessToken: string; idUser: string; userType: string }): void {
    this.token = response.accessToken;
    this.userId = response.idUser;
    this.userType = response.userType;
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return this.token;
  }

  getUserType(): string | null {
    return this.userType;
  }

  getUserId(): string | null {
    return this.userId;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
    this.userId = null;
    this.userType = null;
    this.isAuthenticatedSubject.next(false);
  }
}
