import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { SocketService } from '../../services/socket.service';

import { Song } from '../../interfaces/song';
import { BehaviorSubject } from 'rxjs';
import { trigger, transition, animate, state, style } from '@angular/animations';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':leave', [
        style({ opacity: '*' }),
        animate(250, style({ opacity: 0 }))
      ]),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms 100ms ease', style({ opacity: '*' }))
      ])
    ])
  ]
})
export class ProgressComponent {
  paused$ = new BehaviorSubject(true);
  song?: Song;
  barWidth = 0;
  alternator = 1;
  @ViewChild('audio') audio!: ElementRef;

  constructor(
    private playerService: PlayerService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.socketService.socket$.subscribe((msg: any) => {
      console.log(msg);
      if (msg.type === 'play') { this.paused$.next(false); this.audio.nativeElement.play();  }
      else if (msg.type === 'pause') {  this.paused$.next(true); this.audio.nativeElement.pause(); }
      else if (msg.type === 'skip') { this.nextSong(); this.barWidth = 0;}
    })

    this.playerService.currentSong$.subscribe((song: Song) => {
      console.log('switching');
      this.alternator *= -1;

      if (song) {
        this.paused$.next(true);
        this.audio.nativeElement.pause();
      }
      this.song = song;
    })
  }

  pause() {
    this.socketService.socket.emit('pause');
  }

  play() {
    this.socketService.socket.emit('play');
  }

  skip() {
    this.socketService.socket.emit('skip');
  }

  nextSong() {
    this.song = undefined;
    this.paused$.next(true);
    this.playerService.nextSong();
  }

  readyToPlay() {
    this.socketService.socket.emit('ready');
  }

}
