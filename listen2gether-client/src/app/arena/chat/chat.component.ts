import { style, transition, trigger, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [trigger('enterSmooth', [
    transition('void => *', [
      style({ height: 0, opacity: 0 }),
      animate('100ms ease-out', style({ height : '*', opacity: '*'})),
    ])
  ])]
})
export class ChatComponent {
  messages$;
  message: string = ''
  
  constructor(private messageService: MessageService) {
    this.messages$ = this.messageService.messages$;
  }

  send(e: KeyboardEvent) {
    if (e.code !== 'Enter') return;
    if (!this.message.trim().length) return;

    console.log('message')
    this.messageService.send(this.message.trim());
    this.message = '';
  }
}
