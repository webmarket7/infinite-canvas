import { Component } from '@angular/core';

import { InfiniteCanvasComponent } from './infinite-canvas/infinite-canvas.component';


@Component({
  selector: 'app-root',
  imports: [
    InfiniteCanvasComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
