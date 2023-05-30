import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'listen2gether-client';
  user$ = this.userService.user$;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.loadUser();
  }
}
