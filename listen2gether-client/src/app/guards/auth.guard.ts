import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private userService: UserService,
    private router: Router
  ) { } 

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    
    return this.userService.user$.pipe(
      filter(user => user !== undefined),
      switchMap(user => {
        if (!user) {
          this.router.navigateByUrl('Listen2gether/auth');
          return of(false);
        }
        return of(true);
      })
    )
  }
  
}
