import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { BehaviorSubject } from 'rxjs';
import { transition, trigger, style, animate } from '@angular/animations';
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';

let HOST_URL = 'http://localhost:3000'
HOST_URL = 'https://listen2gether-api.gagansaics.repl.co';

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
  authLoading$ = this.loadingService.isAuthLoading$;

  constructor(
      private socketSerivce: SocketService, 
      private userService: UserService,
      private loadingService: LoadingService
  ) { 
    this.socketSerivce.socket$.subscribe((msg: any) => {
      this.inputRoom = '';
      if (msg.type === 'room-success') this.room = msg.result.room;
      else if (msg.type === 'room-failure') this.error$.next(msg.result);
    })
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

  logout() {
    this.userService.logout();
  }
}
