import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private userSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;
    private jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient) {
        // Inicializa com o usuário do localStorage
        const storedUser = localStorage.getItem('currentUser');
        this.userSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser = this.userSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.userSubject.value;
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
            .pipe(
                map(response => {
                    // Armazena detalhes do usuário e token JWT no localStorage
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token);
                    this.userSubject.next(response.user);
                    return response;
                }),
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    register(registerData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, registerData)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    logout(): void {
        // Remove usuário do localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.userSubject.next(null);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token && !this.jwtHelper.isTokenExpired(token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
