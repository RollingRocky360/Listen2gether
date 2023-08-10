import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PlayerService } from '../../services/player.service';
import { SocketService } from '../../services/socket.service';

import { BehaviorSubject } from 'rxjs'

import { Song } from '../../interfaces/song';
import { query, stagger, style, transition, trigger, animate } from '@angular/animations';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('wave', [
      transition('* => added', [
        query('.nonstatic', [
          style({ opacity: 0 }),
          stagger(15, [
            animate('250ms ease-out', style({ opacity: '*' }))
          ])
        ])
      ]),
      transition('added => *', [
        query('.nonstatic', [
          style({ opacity: '*' }),
          stagger(15, [
            animate('250ms ease-out', style({ opacity: 0 }))
          ])
        ])
      ])
    ])
  ]
})
export class SearchComponent {
  keyWord = '';
  searchResults$ = new BehaviorSubject<Song[]>([]);
  isSearchLoading$ = this.loadingService.isSearchLoading$;

  ngOnInit() {
    this.socketService.socket$.subscribe((msg: any) => {
      console.log(msg);

      if (msg.type === 'search-results') {
        this.loadingService.unsetSearchLoad();
        this.searchResults$.next(msg.result);
      }
      
    })
  }

  search(e: KeyboardEvent | MouseEvent, tap: boolean = false) {
    
    if (!tap && (e as KeyboardEvent).code !== 'Enter') return;
    if (!this.keyWord.length) return;

    this.loadingService.setSearchLoad();

    console.log('search')
    this.searchResults$.next([]);
    this.socketService.socket.emit('search', { keyword: this.keyWord });
  }

  add(song: Song) {
    this.keyWord = '';
    this.searchResults$.next([]);
    this.loadingService.incrementQueueLoadCount();

    this.socketService.socket.emit('add', { url: song.url });
  }

  constructor(
    private socketService: SocketService,
    private loadingService: LoadingService
  ) { }
}
