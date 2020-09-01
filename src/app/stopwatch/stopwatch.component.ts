import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EMPTY, fromEvent, merge, timer } from 'rxjs';
import { buffer, debounceTime, filter, map, mapTo, scan, startWith, switchMap } from 'rxjs/operators';

import {Action} from '../action.enum';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements AfterViewInit {

  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';
  @ViewChild('startBtn') startBtnRef: ElementRef;
  @ViewChild('waitBtn') waitBtnRef: ElementRef;
  @ViewChild('resetBtn') resetBtnRef: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    this.initStopwatch();
  }

  initStopwatch() {
    const start$ = fromEvent(this.startBtnRef.nativeElement, 'click').pipe(mapTo(Action.START));
    const waitBtnClick$ = fromEvent(this.waitBtnRef.nativeElement, 'click');
    const wait$ = waitBtnClick$.pipe(
      buffer(waitBtnClick$.pipe(debounceTime(300))),
      map(clickArray => clickArray.length),
      filter(amount => amount === 2),
      mapTo(Action.WAIT)
    );
    const reset$ = fromEvent(this.resetBtnRef.nativeElement, 'click').pipe(mapTo(Action.RESET));
    const counter$ = timer(0, 1000);

    merge(wait$, start$, reset$)
      .pipe(
        startWith(Action.WAIT),
        switchMap(val => {
          if (val === Action.START) {
            return counter$;
          } else if (val === Action.WAIT) {
            return EMPTY;
          } else if (val === Action.RESET) {
            return counter$.pipe(startWith(-1));
          }
        }),
        scan((acc, n) => n === -1 ? 0 : acc + 1)
      )
      .subscribe(value => {
        this.setTime(value);
      });

  }

  setTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 3600 % 60);

    this.hours = (hours < 10 ? '0' + hours : hours).toString();
    this.minutes = (minutes < 10 ? '0' + minutes : minutes).toString();
    this.seconds = (seconds < 10 ? '0' + seconds : seconds).toString();
  }

}
