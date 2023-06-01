import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { User } from '../interfaces/user';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { filter, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthError } from '../interfaces/autherror';

import { API_URL } from '../../../host-config';
import { LoadingService } from './loading.service';

let BASE_URL = 'http://localhost:3000';
BASE_URL = 'https://listen2gether-api-zfqh.onrender.com';

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
  loading$ = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router, private loadingService: LoadingService) { }

  loadUser(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      // intimates AuthGuard about lack of user data
      // which then redirects the user to the Auth page
      this.user$.next(null);  
      return;
    }

    this.loadingService.setAuthLoad();

    const options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    }
    this.http.get<User>(BASE_URL + '/login', options)
      .subscribe(user => {
        this.loadingService.unsetAuthLoad();
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

  logout() {
    localStorage.removeItem('token');
    this.user$.next(null);
    this.router.navigateByUrl('/auth');
  }

  private requestAuth(url: string, body: any) {
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    this.loadingService.setAuthLoad();

    this.http.post<AuthResponse>(url, body, options)
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.loadingService.unsetAuthLoad();
            this.user$.next(null);
            this.authError$.next(err.error);
          }
          return of(null);
        }),
        filter(resp => resp !== null)
      )
      .subscribe(resp => {
        this.loadingService.unsetAuthLoad();
        resp = resp as AuthResponse;
        localStorage.setItem('token', resp!.token);
        const { token, ...user } = resp!;
        this.user$.next(user);
        this.router.navigateByUrl('/');
      })
  }
}
