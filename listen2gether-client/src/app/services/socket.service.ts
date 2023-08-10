import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { io } from 'socket.io-client';
import { UserService } from './user.service';


let SOCKET_URL = 'wss://listen2gether-api-ti3j.onrender.com'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  socket$ = new BehaviorSubject({ type: 'dummy', result: null});

  constructor(private userService: UserService) {
    this.socket = io(SOCKET_URL, {
      query: {
        _user: this.userService.user$.getValue(),
        _room_id: null
      }
    });
    this.socket.onAny((type, result) => {
      console.log(type, result)
      this.socket$.next({ type, result });
    })
  }
}
