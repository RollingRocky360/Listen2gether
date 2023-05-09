import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Song } from '../../interfaces/song';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
})
export class SongComponent {
  @Input() song!: Song;
  @Input() deletable = false;

  @Output() removeEvent = new EventEmitter<Song>();
}
