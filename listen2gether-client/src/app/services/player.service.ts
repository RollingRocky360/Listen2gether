import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Song } from '../interfaces/song';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  queue: Array<Song> = [];
  queue$: Subject<Song[]>;
  currentSong?: Song;
  currentSong$: Subject<Song>;

  add(song: Song) {
    if (!this.currentSong && !this.queue.length) {
      this.currentSong = song;
      this.currentSong$.next(song);
    } else {
      this.queue.push(song);
      this._broadcastQueue();
    }
  }

  nextSong() {
    const song = this.queue.shift();
    this.currentSong = song;

    if (song) this.currentSong$.next(song);
    this._broadcastQueue();
  }

  remove(song: Song) {
    this.queue = this.queue.filter(s => s.id !== song.id);
    this._broadcastQueue();
  }

  clear() {
    this.queue = [];
    this._broadcastQueue();
  }

  private _broadcastQueue() {
    this.queue$.next(this.queue);
  }

  constructor() {
    this.currentSong$ = new Subject<Song>();
    this.queue$ = new Subject<Array<Song>>();
  }

}
