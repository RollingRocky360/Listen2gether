import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { SocketService } from 'src/app/services/socket.service';

import { trigger, transition, style, animate, query, stagger } from '@angular/animations'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
  animations: [trigger('fadeInOut', [
    transition(':enter', [
      style({ height: 0, padding: 0 }),
      query('.participant', [style({ opacity: 0 })]),
      animate('250ms 0ms ease-out', style({ height: '*', padding: '*' })),
      query('.participant', [
        stagger(30, [
          animate(100, style({ opacity: 1 }))
        ])
      ])
    ]),
    transition(':leave', [ 
      query('.participant', [
        stagger(30, [
          animate(100, style({ opacity: 0 }))
        ])
      ]),
      animate('250ms 0ms ease-out', style({ height: 0, padding: 0 }))
    ])
  ])]
})
export class OptionsComponent {

  @Output() leaveEvent = new EventEmitter();

  participantListExpanded = false;
  participants: User[] = [];
  participants$ = new BehaviorSubject<User[]>([]);

  constructor(private socketService: SocketService) {
    this.socketService.socket$.subscribe((msg: any) => {
      console.log('message', msg);
      if (msg.type === 'join') {
        this.participants.push(msg.result);
        this.participants$.next(this.participants);
      } else if (msg.type === 'room-success' && msg.result.users) {
        console.log(msg.result.users)
        this.participants.push(...msg.result.users);
        this.participants$.next(this.participants);
      } else if (msg.type === 'left') {
        this.participants = this.participants.filter(p => p._id !== msg.result._id);
        this.participants$.next(this.participants);
      }
    })
  }

  leave() {
    this.socketService.socket.emit('leave');
    this.leaveEvent.emit();
  }

}
