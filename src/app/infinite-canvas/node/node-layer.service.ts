import { effect, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Application, Container, ContainerChild, FederatedPointerEvent, Point, Renderer } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import JSONCanvas, { GenericNode } from '@trbn/jsoncanvas';

import { InfiniteCanvasStore } from '../state';
import { InfiniteCanvasNodeRendererService } from './node-renderer.service';


@Injectable()
export class InfiniteCanvasNodeLayerService {
  readonly label: string = 'nodeLayer';

  private _nodeLayer: WritableSignal<Container<ContainerChild> | null> = signal<Container<ContainerChild> | null>(null);

  readonly nodeLayer: Signal<Container<ContainerChild> | null> = this._nodeLayer.asReadonly();

  private _onDragMove: (e: FederatedPointerEvent) => void = () => {
  };

  private _onDragEnd: () => void = () => {
  };

  constructor(private _store: InfiniteCanvasStore,
              private _nodeRendererService: InfiniteCanvasNodeRendererService,
  ) {
    effect(() => {
      const nodeLayer: Container | null = this.nodeLayer();
      const doc: JSONCanvas | null = this._store.doc();

      if (!nodeLayer || !doc) {
        return;
      }

      for (const node of doc.getNodes()) {
        this._renderNodeCard(nodeLayer, node);
      }
    });
  }

  init(app: Application<Renderer>, viewport: Viewport): Container<ContainerChild> {
    if (!app || !viewport) {
      throw new Error('Failed to init node layer: application or viewport not initialized');
    }

    if (viewport.children.length && viewport.getChildByLabel(this.label)) {
      throw new Error('Node layer already exists');
    }

    const nodeLayer: Container<ContainerChild> = this._create(app, viewport);

    this._nodeLayer.set(nodeLayer);

    return nodeLayer;
  }

  private _create(app: Application<Renderer>, viewport: Viewport): Container<ContainerChild> {
    const nodeLayer = new Container();

    nodeLayer.label = this.label;
    nodeLayer.eventMode = 'static';
    nodeLayer.hitArea = app.screen;

    this._onDragMove = (e: FederatedPointerEvent): void => {
      const dragTarget = this._store.dragTarget();

      if (!dragTarget) {
        return;
      }

      const { id, pickupPositionInCanvas, pickupPositionInElement } = dragTarget;
      const draggedCard: Container<ContainerChild> | null = nodeLayer.getChildByLabel(id);

      if (!draggedCard) {
        return;
      }

      const pos: Point = e.getLocalPosition(draggedCard.parent);
      const offsetX = pickupPositionInCanvas.x - pickupPositionInElement.x;
      const offsetY = pickupPositionInCanvas.y - pickupPositionInElement.y;
      const x: number = pos.x + offsetX;
      const y: number = pos.y + offsetY;

      this._store.setNodePosition(id, x, y);
    };

    this._onDragEnd = () => {
      const dragTarget = this._store.dragTarget();

      if (!dragTarget) {
        return;
      }

      nodeLayer.off('pointermove', this._onDragMove);
      this._store.setDragTarget(null);

      const draggedCard = nodeLayer.getChildByLabel(dragTarget.id);

      if (!draggedCard) {
        return;
      }

      draggedCard.cursor = 'grab';
    };

    nodeLayer.on('pointerup', this._onDragEnd);
    nodeLayer.on('pointerupoutside', this._onDragEnd);

    viewport.addChild(nodeLayer);

    return nodeLayer;
  }

  private _renderNodeCard(nodeLayer: Container, node: GenericNode): void {
    let nodeCard: Container<ContainerChild> | null = nodeLayer.getChildByLabel(node.id);

    if (!nodeCard) {
      nodeCard = this._createNodeCard(nodeLayer, node);
    }

    this._updateNodeCardPosition(node, nodeCard);
  }

  private _createNodeCard(nodeLayer: Container,
                          node: GenericNode
  ): Container<ContainerChild> {
    const nodeCard = this._nodeRendererService.createNodeCard(node);

    nodeCard.eventMode = 'static';
    nodeCard.cursor = 'grab';

    nodeCard.on('pointerdown', (e: FederatedPointerEvent): void => {
      const pickupPositionInCanvas: Point = new Point(nodeCard.x, nodeCard.y);
      const pickupPositionInElement: Point = e.getLocalPosition(nodeCard.parent);

      this._store.setDragTarget({
        id: nodeCard.label,
        pickupPositionInCanvas,
        pickupPositionInElement
      });

      nodeCard.cursor = 'grabbing';
      nodeLayer.on('pointermove', this._onDragMove);
    });

    nodeLayer.addChild(nodeCard);

    return nodeCard;
  }

  private _updateNodeCardPosition(node: GenericNode, nodeCard: Container<ContainerChild>): void {
    if (nodeCard.position.x === node.x && nodeCard.position.y === node.y) {
      return;
    }

    nodeCard.position.set(node.x, node.y);
  }
}
