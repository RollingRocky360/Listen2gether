import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

import { AuthError } from '../interfaces/autherror';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  registering = false;
  authLoading$ = this.loadingService.isAuthLoading$;

  errors: AuthError = { 
    email: '', 
    password: '',
    username: '',
  };

  email = '';
  password = '';
  username = '';

  private emailRegex = /^[\w\d_]{3,}(\.[\w\d_]+)*@\w+\.\w+(\.\w+)*$/;

  constructor(private userService: UserService, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.errors = { email: '', password: '', username: '' };
    this.userService.authError$.subscribe((errors: AuthError) => this.errors = errors)
  }

  login() {
    this.errors.email = !this.emailRegex.test(this.email) ? 'is invalid' : '';
    this.errors.password = this.password.trim().length < 4 ? 'must be at least 4 characters': '';
    
    if(this.errors.email || this.errors.password) return;
    
    this.userService.logIn(this.email, this.password.trim());
    this.userService.authError$.subscribe(errors => this.errors = errors);
  }

  signup() {
    this.errors.email = !this.emailRegex.test(this.email) ? 'is invalid' : '';
    this.errors.password = this.password.trim().length < 4 ? 'must be at least 4 characters': '';
    this.errors.username = this.username.trim().length < 3 ? 'must be at least 3 characters' : '';
    
    if(this.errors.email || this.errors.password || this.errors.username) return;
    
    this.userService.signUp(this.email, this.username.trim(), this.password.trim());
    this.userService.authError$.subscribe(errors => {
      console.log(errors);
      this.errors = errors
    });
  }
}
