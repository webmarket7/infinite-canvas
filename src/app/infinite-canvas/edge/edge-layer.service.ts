import { effect, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Application, Container, ContainerChild, Renderer } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import JSONCanvas from '@trbn/jsoncanvas';

import { InfiniteCanvasEdgeRendererService } from './edge-renderer.service';

import { InfiniteCanvasStore } from '../state';


@Injectable()
export class InfiniteCanvasEdgeLayerService {
  readonly label: string = 'edgeLayer';

  private _edgeLayer: WritableSignal<Container<ContainerChild> | null> = signal<Container<ContainerChild> | null>(null);

  readonly edgeLayer: Signal<Container<ContainerChild> | null> = this._edgeLayer.asReadonly();

  constructor(private _store: InfiniteCanvasStore,
              private _edgeRendererService: InfiniteCanvasEdgeRendererService
  ) {
    effect(() => {
      const edgeLayer: Container | null = this.edgeLayer();
      const doc: JSONCanvas | null = this._store.doc();

      if (!edgeLayer || !doc) {
        return;
      }

      this._edgeRendererService.render(edgeLayer, doc);
    });
  }

  init(app: Application<Renderer>, viewport: Viewport): Container<ContainerChild> {
    if (!app || !viewport) {
      throw new Error('Failed to init edge layer: application or viewport not initialized');
    }

    if (viewport.children.length && viewport.getChildByLabel(this.label)) {
      throw new Error('Edge layer already exists');
    }

    const edgeLayer: Container<ContainerChild> = this._create(viewport);

    this._edgeLayer.set(edgeLayer);

    return edgeLayer;
  }

  private _create(viewport: Viewport): Container<ContainerChild> {
    const edgeLayer = new Container();

    edgeLayer.label = this.label;
    viewport.addChild(edgeLayer);

    return edgeLayer;
  }
}
