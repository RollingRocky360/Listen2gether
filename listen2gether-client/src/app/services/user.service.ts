import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { User } from '../interfaces/user';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { filter, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthError } from '../interfaces/autherror';

const { API_HOST, API_PORT } = process.env

const BASE_URL = `https://${API_HOST}`

interface AuthResponse {
  _id: string,
  email: string,
  username: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$ = new BehaviorSubject<
    User | null | undefined
  >(undefined);
  authError$ = new Subject<AuthError>();

  constructor(private http: HttpClient, private router: Router) { }

  loadUser(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.user$.next(null);
      return;
    }

    const options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    }
    this.http.get<User>(BASE_URL + '/login', options)
      .subscribe(user => {
        this.user$.next(user);
      })
  }

  logIn(email: string, password: string): void {

    const body = {
      email, password
    }

    this.requestAuth(BASE_URL + '/login', body);
  }

  signUp(email: string, username: string, password: string) {
    const body = {
      email, username, password
    }

    this.requestAuth(BASE_URL + '/signup', body);
  }

  private requestAuth(url: string, body: any) {
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    this.http.post<AuthResponse>(url, body, options)
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.user$.next(null);
            this.authError$.next(err.error);
          }
          return of(null);
        }),
        filter(resp => resp !== null)
      )
      .subscribe(resp => {
        resp = resp as AuthResponse;
        localStorage.setItem('token', resp!.token);
        const { token, ...user } = resp!;
        this.user$.next(user);
        this.router.navigateByUrl('/');
      })
  }
}
