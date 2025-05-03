import { Inject, Injectable } from '@angular/core';
import { Application, ContainerChild, EventSystem } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { GenericNode } from '@trbn/jsoncanvas';

import { INFINITE_CANVAS_VIEWPORT_CONFIG, InfiniteCanvasViewportConfig } from './viewport.config';


@Injectable()
export class InfiniteCanvasViewportService {
  constructor(@Inject(INFINITE_CANVAS_VIEWPORT_CONFIG) private _config: InfiniteCanvasViewportConfig) {
  }

  create(app: Application): Viewport {
    const viewport = new Viewport({
      events: app.renderer.events as EventSystem,
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      worldWidth: null,
      worldHeight: null,
      passiveWheel: false,
      stopPropagation: true,
    });

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

  makeSprite(node: GenericNode): ContainerChild | null {
    console.log('makeSprite', node);

    return null;
  }
}
