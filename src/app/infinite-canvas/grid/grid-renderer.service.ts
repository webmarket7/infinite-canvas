import { Inject, Injectable } from '@angular/core';
import { Application, Container, ContainerChild, Graphics, Point, Rectangle, Texture, TilingSprite } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { INFINITE_CANVAS_GRID_CONFIG, InfiniteCanvasGridConfig } from './grid.config';


@Injectable()
export class InfiniteCanvasGridRendererService {
  constructor(@Inject(INFINITE_CANVAS_GRID_CONFIG) private _config: InfiniteCanvasGridConfig) {
  }

  attachGridSprite(app: Application, viewport: Viewport, gridLayer: Container<ContainerChild>): void {
    const gridSprite: TilingSprite = this._createGridSprite(app);

    const handler = () => syncGrid(viewport, gridSprite, this._config.cellSize);

    handler();
    viewport.on('moved', handler);
    viewport.on('zoomed', handler);
    viewport.on('resize', handler);

    gridLayer.addChild(gridSprite);
  }

  private _createGridSprite(app: Application): TilingSprite {
    const texture = this._createTexture(app);

    return new TilingSprite({
      texture,
      width: 1,
      height: 1
    });
  }

  private _createTexture(app: Application): Texture {
    const { cellSize, dotColor, dotRadius } = this._config;

    const graphics: Graphics = new Graphics()
      .rect(0, 0, cellSize, cellSize).fill({ color: 0xffffff, alpha: 0 })
      .circle(dotRadius, dotRadius, dotRadius).fill(dotColor);

    return app.renderer.generateTexture({
      target: graphics,
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
