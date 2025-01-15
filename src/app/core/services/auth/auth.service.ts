import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LoginCredentials } from '../../interfaces/login.interface';
import { AuthResponse } from '../../interfaces/auth.interfece';

// Constante para modo desarrollo
const DEVELOPMENT_MODE = true; // Cambiar a true para activar persistencia en desarrollo

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseUrl + '/auth';
  private token: string | null = null;
  private userType: string | null = null;
  private userId: string | null = null;
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Intentar cargar datos de autenticación al iniciar el servicio
    if (DEVELOPMENT_MODE) {
      this.loadDevData();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.setAuthData(response);
  }

  setAuthData(response: AuthResponse): void {
    if (!response.accessToken || !response.idUser || !response.userType) {
      throw new Error('Invalid authentication response');
    }

    this.token = response.accessToken;
    this.userId = response.idUser;
    this.userType = response.userType;
    this.isAuthenticatedSubject.next(true);

    if (DEVELOPMENT_MODE) {
      this.saveDevData(response);
    }
  }

  // Getters con tipo de retorno explícito
  getToken(): string | null {
    return this.token;
  }

  getUserType(): string | null {
    return this.userType;
  }

  getUserId(): string | null {
    return this.userId;
  }

  // Método para verificar autenticación
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  // Método para cerrar sesión
  logout(): void {
    this.clearAuthData();
    // Aquí podrías agregar una llamada al backend si es necesario
  }

  private clearAuthData(): void {
    this.token = null;
    this.userId = null;
    this.userType = null;
    this.isAuthenticatedSubject.next(false);
    
    if (DEVELOPMENT_MODE) {
      localStorage.removeItem('dev_auth_data');
    }
  }

  private loadDevData(): void {
    try {
      const savedData = localStorage.getItem('dev_auth_data');
      if (savedData) {
        const parsedData: AuthResponse = JSON.parse(savedData);
        if (this.isValidAuthData(parsedData)) {
          this.setAuthData(parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading development auth data:', error);
      this.clearAuthData();
    }
  }

  private saveDevData(data: AuthResponse): void {
    try {
      localStorage.setItem('dev_auth_data', JSON.stringify({
        accessToken: data.accessToken,
        idUser: data.idUser,
        userType: data.userType
      }));
    } catch (error) {
      console.error('Error saving development auth data:', error);
    }
  }

  private isValidAuthData(data: any): data is AuthResponse {
    return (
      data &&
      typeof data.accessToken === 'string' &&
      typeof data.idUser === 'string' &&
      typeof data.userType === 'string'
    );
  }

  // Método para verificar si el token está expirado (opcional)
  private isTokenExpired(): boolean {
    if (!this.token) return true;
    
    try {
      const token = this.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate <= new Date();
    } catch {
      return true;
    }
  }
}
