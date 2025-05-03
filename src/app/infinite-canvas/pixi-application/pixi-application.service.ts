import { ElementRef, Inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Application, Renderer } from 'pixi.js';

import {
  INFINITE_CANVAS_PIXI_APPLICATION_CONFIG,
  InfiniteCanvasPixiApplicationConfig
} from './pixi-application.config';


@Injectable()
export class InfiniteCanvasPixiApplicationService {
  private _app: WritableSignal<Application | null> = signal<Application | null>(null);

  readonly app: Signal<Application | null> = this._app.asReadonly();

  constructor(@Inject(INFINITE_CANVAS_PIXI_APPLICATION_CONFIG) private _config: InfiniteCanvasPixiApplicationConfig) {
  }

  async init(host: ElementRef<HTMLElement>): Promise<Application<Renderer>> {
    if (this._app()) {
      throw new Error('Application already initialized');
    }

    const app = new Application();

    await app.init({
      resizeTo: host.nativeElement,
      autoDensity: this._config.autoDensity,
      backgroundColor: this._config.background,
    });

    host.nativeElement.appendChild(app.canvas);

    this._app.set(app);

    return app;
  }

  destroy(): void {
    const app = this._app();

    if (app) {
      app.destroy(true, { children: true });
      this._app.set(null);
    }
  }
}
