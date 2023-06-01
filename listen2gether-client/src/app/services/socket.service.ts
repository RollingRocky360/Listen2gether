import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { io } from 'socket.io-client';


let SOCKET_URL = 'ws://localhost:3000'
SOCKET_URL = 'wss://listen2gether-api-zfqh.onrender.com'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  socket$ = new BehaviorSubject({ type: 'dummy', result: null});

  constructor() {
    this.socket = io(SOCKET_URL);
    this.socket.onAny((type, result) => {
      console.log(type, result)
      this.socket$.next({ type, result });
    })
  }
}
