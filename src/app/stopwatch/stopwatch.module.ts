import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StopwatchComponent } from './stopwatch.component';



@NgModule({
  declarations: [StopwatchComponent],
  exports: [
    StopwatchComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StopwatchModule { }
