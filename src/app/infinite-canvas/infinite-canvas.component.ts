import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Viewport } from 'pixi-viewport';
import { Application, Renderer } from 'pixi.js';

import { INFINITE_CANVAS_PROVIDERS } from './infinite-canvas.providers';

import { InfiniteCanvasPixiApplicationService } from './pixi-application';
import { InfiniteCanvasViewportService } from './viewport';
import { InfiniteCanvasGridService } from './grid';


@Component({
  selector: 'app-infinite-canvas',
  imports: [],
  templateUrl: './infinite-canvas.component.html',
  styleUrl: './infinite-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ...INFINITE_CANVAS_PROVIDERS
  ],
})
export class InfiniteCanvasComponent implements AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) private _host!: ElementRef<HTMLDivElement>;

  constructor(
    private _pixiApplicationService: InfiniteCanvasPixiApplicationService,
    private _viewportService: InfiniteCanvasViewportService,
    private _gridService: InfiniteCanvasGridService,
  ) {
  }

  async ngAfterViewInit(): Promise<void> {
    const app: Application<Renderer> = await this._pixiApplicationService.init(this._host);
    const viewport: Viewport = this._viewportService.create(app);

    this._gridService.attach(app, viewport);
  }
}
