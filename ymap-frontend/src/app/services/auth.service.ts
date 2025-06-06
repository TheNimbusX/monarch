import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment.prod';

interface User {
  id: number;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = environment.apiUrl;
  private tokenKey = 'authToken';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  login(data: { username: string; password: string }) {
    return this.http.post<any>(`${this.api}/login`, data).pipe(
      tap((response) => {
        const user: User = { id: response.id, username: response.username };
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(data: { username: string; password: string }) {
    return this.http.post(`${this.api}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id ?? null;
  }

  getUsername(): string | null {
    return this.currentUserSubject.value?.username ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser() {
    return this.http.get<User>(`${this.api}/user`);
  }
}
