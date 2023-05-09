import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArenaComponent } from './arena/arena.component';
import { AuthComponent } from './auth/auth.component';
import { SearchComponent } from './arena/search/search.component';
import { ProgressComponent } from './arena/progress/progress.component';
import { ChatComponent } from './arena/chat/chat.component';
import { QueueComponent } from './arena/queue/queue.component';
import { SongComponent } from './arena/song/song.component';
import { OptionsComponent } from './arena/options/options.component';

import { timePipe } from './pipes/time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ArenaComponent,
    AuthComponent,
    SearchComponent,
    ProgressComponent,
    ChatComponent,
    QueueComponent,
    SongComponent,
    timePipe,
    OptionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
