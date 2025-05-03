import { ElementRef, Injectable } from '@angular/core';
import { Application, Renderer } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { InfiniteCanvasPixiApplicationService } from './pixi-application';
import { InfiniteCanvasViewportService } from './viewport';
import { InfiniteCanvasGridLayerService } from './grid';
import { InfiniteCanvasNodeLayerService } from './node';
import { InfiniteCanvasEdgeLayerService } from './edge';


@Injectable()
export class InfiniteCanvasService {
  constructor(
    private _pixiApplicationService: InfiniteCanvasPixiApplicationService,
    private _viewportService: InfiniteCanvasViewportService,
    private _gridLayerService: InfiniteCanvasGridLayerService,
    private _nodeLayerService: InfiniteCanvasNodeLayerService,
    private _edgeLayerService: InfiniteCanvasEdgeLayerService,
  ) {
  }

  async init(host: ElementRef<HTMLElement>): Promise<void> {
    const app: Application<Renderer> = await this._pixiApplicationService.init(host);
    const viewport: Viewport = this._viewportService.init(app);

    this._gridLayerService.init(app, viewport);
    this._nodeLayerService.init(app, viewport);
    this._edgeLayerService.init(app, viewport);
  }

  destroy(): void {
    this._pixiApplicationService.destroy();
  }
}
