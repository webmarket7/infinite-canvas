import { Inject, Injectable } from '@angular/core';
import { Application, Container, Graphics, Point, Rectangle, Texture, TilingSprite } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { INFINITE_CANVAS_GRID_CONFIG, InfiniteCanvasGridConfig } from './grid.config';


@Injectable()
export class InfiniteCanvasGridService {
  constructor(@Inject(INFINITE_CANVAS_GRID_CONFIG) private _config: InfiniteCanvasGridConfig) {
  }

  attach(app: Application, targetLayer: Container, viewport: Viewport): void {
    const texture = this._createTexture(app);
    const grid = new TilingSprite({
      texture,
      width: 1,   // resized immediately by handler()
      height: 1
    });

    targetLayer.addChild(grid);

    const handler = () => syncGrid(viewport, grid, this._config.cellSize);

    handler();                              // initial fit
    viewport.on('moved', handler);
    viewport.on('zoomed', handler);
    viewport.on('resize', handler);
  }

  private _createTexture(app: Application): Texture {
    const { cellSize, dotColor, dotRadius } = this._config;

    const g = new Graphics()
      .rect(0, 0, cellSize, cellSize).fill({ color: 0xffffff, alpha: 0 })
      .circle(dotRadius, dotRadius, dotRadius).fill(dotColor);

    return app.renderer.generateTexture({
      target: g,
      frame: new Rectangle(0, 0, cellSize, cellSize),
      resolution: window.devicePixelRatio,
      clearColor: 0x00000000
    });
  }
}

export function syncGrid(
  viewport: Viewport,
  sprite: TilingSprite,
  cell: number
): void {
  const topLeft = viewport.toWorld(new Point(0, 0));

  sprite.position.set(
    Math.floor(topLeft.x / cell) * cell,
    Math.floor(topLeft.y / cell) * cell
  );

  sprite.width = viewport.screenWidth / viewport.scale.x + cell * 2;
  sprite.height = viewport.screenHeight / viewport.scale.y + cell * 2;
}
