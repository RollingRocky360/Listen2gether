import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Subject } from 'rxjs';

import { Song } from 'src/app/interfaces/song';
import { PlayerService } from 'src/app/services/player.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('shrinkOut', [
      transition('* => void', [
        style({ opacity: '*', height: '*' }),
        animate(200, style({ opacity: 0 })),
        animate('300ms ease-out', style({ height: 0 })),
      ]),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: '*' }))
      ])
    ]),
  ]
})
export class QueueComponent implements OnInit{
  queue$: Subject<Song[]>;

  constructor(
    private playerService: PlayerService,
    private socketService: SocketService
  ) {
    this.queue$ = this.playerService.queue$;
  }

  ngOnInit() {
    this.socketService.socket$.subscribe((msg: any) => {
      if (msg.type === 'remove') {
        this.playerService.remove(msg.result);
      }
    })
  }

  remove(song: Song) {
    this.socketService.socket.emit('remove', song);
  }

}
