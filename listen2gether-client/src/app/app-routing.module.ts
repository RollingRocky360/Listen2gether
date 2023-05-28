import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArenaComponent } from './arena/arena.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: ArenaComponent, 
    canActivate: [ AuthGuard ]
  },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
