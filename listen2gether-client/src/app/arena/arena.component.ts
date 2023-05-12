import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { BehaviorSubject, catchError, of, filter } from 'rxjs';
import { transition, trigger, style, animate } from '@angular/animations';
import { UserService } from '../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';

import { HOST, SERVER_PORT } from '../../host-config';
const HOST_URL = `http://${HOST}:${SERVER_PORT}`

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
  animations: [trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0, height: 0, margin: 0 }),
      animate('200ms 0s ease-in-out', style({ height: '*', margin: '*' })),
      animate(50, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate(50, style({ opacity: 0 })),
      animate('200ms 0s ease-in-out', style({ height: 0, margin: 0 })),
    ])
  ])]
})
export class ArenaComponent {

  room = '';
  inputRoom = '';
  error$ = new BehaviorSubject<string>('');
  user = this.userService.user$.getValue();
  username = this.user?.username;

  constructor(
      private socketSerivce: SocketService, 
      private userService: UserService,
      private http: HttpClient
  ) { 
    this.socketSerivce.socket$.subscribe((msg: any) => {
      this.inputRoom = '';
      if (msg.type === 'room-success') this.room = msg.result.room;
      else if (msg.type === 'room-failure') this.error$.next(msg.result);
    })
    this.userService.user$.subscribe(user => this.user = user);
  }

  private validate() {
    const fourDigNumRegex = /^\d\d\d\d$/;
    if (!fourDigNumRegex.test(this.inputRoom)) {
      this.inputRoom = '';
      this.error$.next('Room code must be a 4-digit number');
      return false;
    } else {
      this.error$.next('');
      return true;
    };  
  }

  joinRoom() {
    if (!this.validate()) return;
    this.socketSerivce.socket.emit('join', {
      room: this.inputRoom,
      user: this.userService.user$.getValue(),
    });

  }

  createRoom() {
    if (!this.validate()) return;
    this.socketSerivce.socket.emit('create', {
      room: this.inputRoom,
      user: this.userService.user$.getValue(),
    });
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

  async onUsernameChange(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    if (!this.username!.trim().length) return;

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    }

    this.http.post<User>(HOST_URL + '/username-update', {username: this.username}, options)
      .subscribe(user => {
        this.userService.user$.next(user);
      })
  }
  
}
