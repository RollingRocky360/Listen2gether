import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { io } from 'socket.io-client';

import { HOST } from '../../host-config'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  socket$ = new BehaviorSubject({ type: 'dummy', result: null});

  constructor() {
    this.socket = io('wss://' + HOST);
    this.socket.onAny((type, result) => {
      console.log(type, result)
      this.socket$.next({ type, result });
    })
  }
}
