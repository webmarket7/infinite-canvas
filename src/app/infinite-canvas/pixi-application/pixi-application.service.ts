import { ElementRef, Inject, Injectable } from '@angular/core';
import { Application } from 'pixi.js';

import {
  INFINITE_CANVAS_PIXI_APPLICATION_CONFIG,
  InfiniteCanvasPixiApplicationConfig
} from './pixi-application.config';


@Injectable()
export class InfiniteCanvasPixiApplicationService {
  private _app?: Application;

  constructor(@Inject(INFINITE_CANVAS_PIXI_APPLICATION_CONFIG) private _config: InfiniteCanvasPixiApplicationConfig) {
  }

  async init(host: ElementRef<HTMLDivElement>): Promise<Application> {
    if (this._app) {
      return this._app;
    }

    const app = new Application();

    await app.init({
      resizeTo: host.nativeElement,
      autoDensity: this._config.autoDensity,
      backgroundColor: this._config.background,
    });

    host.nativeElement.appendChild(app.canvas);

    return (this._app = app);
  }
}
