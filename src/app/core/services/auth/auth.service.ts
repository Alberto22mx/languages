import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, Observable, shareReplay, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LoginCredentials } from '../../interfaces/login.interface';
import { AuthResponse } from '../../interfaces/auth.interfece';

const DEVELOPMENT_MODE = !environment.production;
const AUTH_STORAGE_KEY = 'dev_auth_data';
const LAST_ACTIVITY_KEY = 'last_activity_at';
const INACTIVITY_LIMIT_MS = 20 * 60 * 1000;
const ACTIVITY_THROTTLE_MS = 1000;
const REFRESH_LEEWAY_MS = 60 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.baseUrl + '/auth';
  private token: string | null = null;
  private userType: string | null = null;
  private userId: string | null = null;
  private userName: string | null = null;
  private registrationNumber: string | null = null;
  private lastActivityAt = 0;
  private lastProcessedActivityAt = 0;
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private monitoring = false;
  private refreshRequest?: Observable<AuthResponse>;

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly activityHandler = () => this.registerActivity();

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    if (DEVELOPMENT_MODE) this.loadPersistedSession();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response) => this.setAuthData(response)),
      catchError((error) => throwError(() => error)),
    );
  }

  refreshAccessToken(): Observable<AuthResponse> {
    if (this.refreshRequest) return this.refreshRequest;
    this.refreshRequest = this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => this.setAuthData(response, false)),
        finalize(() => (this.refreshRequest = undefined)),
        shareReplay(1),
      );
    return this.refreshRequest;
  }

  setAuthData(response: AuthResponse, registerActivity = true): void {
    if (!response.accessToken || !response.idUser || !response.userType || !response.userName || !response.registrationNumber) {
      throw new Error('Invalid authentication response');
    }
    this.token = response.accessToken;
    this.userId = response.idUser;
    this.userType = response.userType;
    this.userName = response.userName;
    this.registrationNumber = response.registrationNumber;
    this.isAuthenticatedSubject.next(true);

    if (registerActivity || !this.lastActivityAt) {
      this.lastActivityAt = Date.now();
      this.persistLastActivity();
    }
    this.persistAuthData(response);
    this.startMonitoring();
    this.scheduleInactivityLogout();
    this.scheduleTokenRefresh();
  }

  getToken(): string | null { return this.token; }
  getUserType(): string | null { return this.userType; }
  getUserId(): string | null { return this.userId; }
  getUserName(): string | null { return this.userName; }
  getRegistrationNumber(): string | null { return this.registrationNumber; }

  isAuthenticated(): boolean {
    return this.token !== null && !this.hasExceededInactivityLimit();
  }

  logout(): void {
    if (!this.token) {
      this.clearSessionAndRedirect();
      return;
    }
    this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(finalize(() => this.clearSessionAndRedirect()))
      .subscribe({ error: () => undefined });
  }

  forceLogout(): void {
    this.clearSessionAndRedirect();
  }

  private registerActivity(): void {
    if (!this.token) return;
    const now = Date.now();
    if (now - this.lastProcessedActivityAt < ACTIVITY_THROTTLE_MS) return;
    this.lastProcessedActivityAt = now;
    this.lastActivityAt = now;
    this.persistLastActivity();
    this.scheduleInactivityLogout();

    if (this.getTokenExpirationTime() - now <= REFRESH_LEEWAY_MS) {
      this.refreshAccessToken().subscribe({ error: () => this.forceLogout() });
    }
  }

  private startMonitoring(): void {
    if (this.monitoring) return;
    ACTIVITY_EVENTS.forEach((eventName) =>
      document.addEventListener(eventName, this.activityHandler, { passive: true }),
    );
    this.monitoring = true;
  }

  private stopMonitoring(): void {
    if (this.monitoring) {
      ACTIVITY_EVENTS.forEach((eventName) => document.removeEventListener(eventName, this.activityHandler));
    }
    this.monitoring = false;
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.inactivityTimer = undefined;
    this.refreshTimer = undefined;
  }

  private scheduleInactivityLogout(): void {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    const remaining = INACTIVITY_LIMIT_MS - (Date.now() - this.lastActivityAt);
    if (remaining <= 0) {
      this.logout();
      return;
    }
    this.inactivityTimer = setTimeout(() => this.logout(), remaining);
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    const refreshIn = this.getTokenExpirationTime() - Date.now() - REFRESH_LEEWAY_MS;
    this.refreshTimer = setTimeout(() => {
      if (this.hasExceededInactivityLimit()) {
        this.logout();
        return;
      }
      this.refreshAccessToken().subscribe({ error: () => this.forceLogout() });
    }, Math.max(0, refreshIn));
  }

  private getTokenExpirationTime(): number {
    if (!this.token) return 0;
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return typeof payload.exp === 'number' ? payload.exp * 1000 : 0;
    } catch {
      return 0;
    }
  }

  private hasExceededInactivityLimit(): boolean {
    return !this.lastActivityAt || Date.now() - this.lastActivityAt >= INACTIVITY_LIMIT_MS;
  }

  private clearSessionAndRedirect(): void {
    this.stopMonitoring();
    this.token = null;
    this.userId = null;
    this.userType = null;
    this.userName = null;
    this.registrationNumber = null;
    this.lastActivityAt = 0;
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    this.router.navigate(['/login']);
  }

  private loadPersistedSession(): void {
    try {
      const savedData = localStorage.getItem(AUTH_STORAGE_KEY);
      this.lastActivityAt = Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || 0;
      if (!savedData || this.hasExceededInactivityLimit()) {
        this.clearStoredSession();
        return;
      }
      const parsedData: AuthResponse = JSON.parse(savedData);
      if (this.isValidAuthData(parsedData)) this.setAuthData(parsedData, false);
      else this.clearStoredSession();
    } catch {
      this.clearStoredSession();
    }
  }

  private persistAuthData(data: AuthResponse): void {
    if (DEVELOPMENT_MODE) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }

  private persistLastActivity(): void {
    if (DEVELOPMENT_MODE) localStorage.setItem(LAST_ACTIVITY_KEY, this.lastActivityAt.toString());
  }

  private clearStoredSession(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    this.lastActivityAt = 0;
  }

  private isValidAuthData(data: unknown): data is AuthResponse {
    const value = data as AuthResponse;
    return !!value && typeof value.accessToken === 'string' && typeof value.idUser === 'string' &&
      typeof value.userType === 'string' && typeof value.userName === 'string' &&
      typeof value.registrationNumber === 'string';
  }
}
