import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

import { BehaviorSubject, catchError, of, Subject, debounceTime } from 'rxjs';
import { filter } from 'rxjs/operators'

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';

let HOST_URL = 'http://localhost:3000'
HOST_URL = 'https://listen2gether-api-zfqh.onrender.com';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  user = this.userService.user$.getValue();
  username = this.user?.username;
  usernameUpdate$ = new Subject<string>()

  constructor(private userService: UserService, private http: HttpClient) {
    
    this.userService.user$.subscribe(user => this.user = user);
    
    this.usernameUpdate$
      .pipe(
        debounceTime(250),
        filter((item: string) => item.length < 23)
      )
      .subscribe((username: string) => {
        if (username.length < 2) {
          this.username = this.user!.username;
          return;
        }

        const options = {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
          })
        }

        this.http.post<User>(HOST_URL + '/username-update', { username }, options)
          .subscribe(user => {
            this.userService.user$.next(user);
          })
      })
  }

  async onPfpAdd(event: any) {
    const file: File = event.target!.files[0];
    const formData = new FormData();
    formData.append('pfp', file);
    
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    }
    this.http.post<User>(HOST_URL + '/pfp-upload', formData, options)
      .pipe(
        catchError(err => {
          return of(null);
        }),
        filter(data => data !== null)
      )
      .subscribe(user => {
        this.userService.user$.next(user);
      })
  }  

  async deletePfp() {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    }
    this.http.post<User>(HOST_URL + '/pfp-delete', '', options)
      .pipe(
        catchError(err => {
          return of(null);
        }),
        filter(data => data !== null)
      )
      .subscribe(user => {
        this.userService.user$.next(user);
      })
  }  
}
