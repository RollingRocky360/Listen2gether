import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'time' })
export class timePipe implements PipeTransform {
    transform(seconds: number | string): string {
        if (typeof seconds === 'string') return seconds;

        seconds = Math.floor(seconds);
        const secs = Math.floor(seconds % 60);
        const mins = Math.floor(seconds / 60 % 60);
        const hours = Math.floor(seconds / 3600);

        return (
            '' + (hours ? hours + ':' : '') + 
            (mins ? mins + ':' : '0:') + 
            (secs ? (secs < 10 ? '0' + secs : secs) : '00')
        ); 
    }
}