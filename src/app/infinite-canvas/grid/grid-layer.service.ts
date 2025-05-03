import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { InfiniteCanvasGridRendererService } from './grid-renderer.service';
import { Application, Container, ContainerChild, Renderer } from 'pixi.js';
import { Viewport } from 'pixi-viewport';


@Injectable()
export class InfiniteCanvasGridLayerService {
  readonly label: string = 'gridLayer';

  private _gridLayer: WritableSignal<Container<ContainerChild> | null> = signal<Container<ContainerChild> | null>(null);

  readonly gridLayer: Signal<Container<ContainerChild> | null> = this._gridLayer.asReadonly();

  constructor(private _gridRendererService: InfiniteCanvasGridRendererService) {
  }

  init(app: Application<Renderer>, viewport: Viewport): Container<ContainerChild> {
    if (!app || !viewport) {
      throw new Error('Failed to init grid layer: application or viewport not initialized');
    }

    if (viewport.children.length && viewport.getChildByLabel(this.label)) {
      throw new Error('Grid layer already exists');
    }

    const gridLayer: Container<ContainerChild> = this._create(viewport);

    this._gridRendererService.attachGridSprite(app, viewport, gridLayer);

    this._gridLayer.set(gridLayer);

    return gridLayer;
  }

  private _create(viewport: Viewport): Container<ContainerChild> {
    const gridLayer = new Container();

    gridLayer.label = this.label;

    viewport.addChild(gridLayer);

    return gridLayer;
  }
}
