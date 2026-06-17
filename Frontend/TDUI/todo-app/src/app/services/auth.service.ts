import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../models/auth/login-request.model';
import { RegisterRequest } from '../models/auth/register-request.model';
import { AuthResponse } from '../models/auth/auth-response.model';
import { User } from '../models/auth/user-model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    private readonly TOKEN_KEY = 'kanban:token';
    private readonly USER_KEY = 'kanban:user';
    private readonly EXPIRES_KEY = 'kanban:expiresAt';

    // Signals: estado reactivo del usuario actual
    private readonly _currentUser = signal<User | null>(this.readUserFromStorage());
    readonly currentUser = this._currentUser.asReadonly();
    readonly isLoggedIn = computed(() => this._currentUser() !== null && !this.isTokenExpired());

    constructor(private http: HttpClient) { }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
            tap(response => this.persistSession(response))
        );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => this.persistSession(response))
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.EXPIRES_KEY);
        this._currentUser.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isTokenExpired(): boolean {
        const expiresAt = localStorage.getItem(this.EXPIRES_KEY);
        if (!expiresAt) return true;
        return new Date(expiresAt) <= new Date();
    }

    // ----- Helpers privados -----

    private persistSession(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        localStorage.setItem(this.EXPIRES_KEY, response.expiresAt);
        this._currentUser.set(response.user);
    }

    private readUserFromStorage(): User | null {
        try {
            const raw = localStorage.getItem(this.USER_KEY);
            if (!raw) return null;
            return JSON.parse(raw) as User;
        } catch {
            return null;
        }
    }
}