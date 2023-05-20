import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { io } from 'socket.io-client';

const { API_HOST, API_PORT } = process.env;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  socket$ = new BehaviorSubject({ type: 'dummy', result: null});

  constructor() {
    this.socket = io(`wss://${API_HOST}:${API_PORT}`);
    this.socket.onAny((type, result) => {
      console.log(type, result)
      this.socket$.next({ type, result });
    })
  }
}
