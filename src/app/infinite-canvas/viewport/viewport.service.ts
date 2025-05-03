import { computed, Inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Application, EventSystem } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { INFINITE_CANVAS_VIEWPORT_CONFIG, InfiniteCanvasViewportConfig } from './viewport.config';
import { InfiniteCanvasPixiApplicationService } from '../pixi-application';


@Injectable()
export class InfiniteCanvasViewportService {
  readonly label: string = 'viewport';

  private _viewport: WritableSignal<Viewport | null> = signal<Viewport | null>(null);

  readonly viewport: Signal<Viewport | null> = this._viewport.asReadonly();

  constructor(private readonly _pixiApplicationService: InfiniteCanvasPixiApplicationService,
              @Inject(INFINITE_CANVAS_VIEWPORT_CONFIG) private _config: InfiniteCanvasViewportConfig
  ) {
  }

  init(app: Application): Viewport {
    if (!app) {
      throw new Error('Failed to init viewport: application not initialized');
    }

    if (app.stage.children.length && app.stage.getChildByLabel(this.label)) {
      throw new Error('Viewport already exists');
    }

    const viewport: Viewport = this._create(app);

    this._viewport.set(viewport);

    return viewport;
  }

  private _create(app: Application): Viewport {
    const viewport = new Viewport({
      events: app.renderer.events as EventSystem,
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      worldWidth: null,
      worldHeight: null,
      passiveWheel: false,
      stopPropagation: true,
    });

    viewport.label = this.label;
    viewport.eventMode = 'static';

    viewport
      .drag({ factor: this._config.dragFactor, mouseButtons: 'middle', wheel: false })
      .pinch()
      .wheel({
        percent: this._config.wheelPercent,
        smooth: this._config.wheelSmooth,
        keyToPress: [ 'ControlLeft', 'ControlRight' ],
        trackpadPinch: true,
        wheelZoom: true,
      })
      .decelerate({
        friction: this._config.inertFriction,
        minSpeed: this._config.inertCutoff,
      })
      .clampZoom({ minScale: this._config.zoomMin, maxScale: this._config.zoomMax });

    app.stage.addChild(viewport);

    return viewport;
  }
}
