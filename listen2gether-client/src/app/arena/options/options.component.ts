import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

import { trigger, transition, style, animate, query, stagger } from '@angular/animations'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
  animations: [trigger('fadeInOut', [
    transition(':enter', [
      style({ height: 0 }),
      query('.participant', [style({ opacity: 0 })]),
      animate('250ms 0ms ease-out', style({ height: '*' })),
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
      animate('250ms 0ms ease-out', style({ height: 0 }))
    ])
  ])]
})
export class OptionsComponent implements OnInit{

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
      }
    })
  }

  ngOnInit(): void {
      
  }

}
