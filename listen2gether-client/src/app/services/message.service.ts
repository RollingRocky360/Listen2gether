import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

interface Message {
  _id : string,
  username: string,
  message: string,
  pfp?: string,
  noDetails?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: Message[] = []
  messages$ = new Subject<Message[]>();

  constructor(private socketService: SocketService, private userService: UserService) { 
    this.socketService.socket$.subscribe( (msg: any) => {
      if (msg.type !== 'message') return;
      this.addMessage(msg.result);
    })
  }
  
  send(message: string) {
    const user = this.userService.user$.getValue();
    const msg: Message = {...user, message } as Message;
    this.addMessage(msg);
    this.socketService.socket.emit('message', msg)
  }

  addMessage(message: Message) {
    if (this.messages.length && this.messages[0]?._id === message._id)
      message.noDetails = true;

    this.messages.unshift(message);

    if (this.messages.length > 200) {
      this.messages.pop();
      this.messages[this.messages.length-1].noDetails = false;
    }
    
    this.messages$.next(this.messages);
  }
}
