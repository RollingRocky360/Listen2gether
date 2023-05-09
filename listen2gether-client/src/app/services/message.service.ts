import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

interface Message {
  userId : string,
  username: string,
  message: string,
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

      const message = msg.result;
      if (this.messages.length && this.messages[0]?.userId === message.userId)
        message.noDetails = true;

      this.messages.unshift(message);

      if (this.messages.length > 200) {
        this.messages.pop();
        this.messages[this.messages.length-1].noDetails = false;
      }
      
      this.messages$.next(this.messages);
    })
  }

  send(message: string) {
    const user = this.userService.user$.getValue();

    this.socketService.socket.emit('message', {
      userId: user?._id,
      username: user?.username,
      message,
    })
  }
}
