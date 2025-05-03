import { effect, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import {
  Application,
  Bounds,
  Container,
  ContainerChild,
  FederatedPointerEvent,
  Point,
  Rectangle,
  Renderer
} from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import JSONCanvas, { GenericNode } from '@trbn/jsoncanvas';

import { InfiniteCanvasStore } from '../state';
import { InfiniteCanvasNodeRendererService } from './node-renderer.service';
import { InfiniteCanvasViewportService } from '../viewport';


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
              private _viewportService: InfiniteCanvasViewportService
  ) {
    effect(() => {
      const viewport = this._viewportService.viewport();
      const nodeLayer: Container | null = this.nodeLayer();
      const doc: JSONCanvas | null = this._store.doc();

      if (!viewport || !nodeLayer || !doc) {
        return;
      }

      for (const node of doc.getNodes()) {
        this._renderNodeCard(viewport, nodeLayer, node);
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

    this._onDragMove = (e: FederatedPointerEvent): void => {
      const dragTarget = this._store.dragTarget();
      if (!dragTarget) {
        return;
      }

      const { id, pickupPositionInCanvas, pickupPositionInElement } = dragTarget;
      const draggedCard = nodeLayer.getChildByLabel(id) as Container<ContainerChild> | null;
      if (!draggedCard) {
        return;
      }

      const parent = draggedCard.parent!;
      const pos: Point = e.getLocalPosition(parent);
      const offsetX = pickupPositionInCanvas.x - pickupPositionInElement.x;
      const offsetY = pickupPositionInCanvas.y - pickupPositionInElement.y;
      const x = pos.x + offsetX;
      const y = pos.y + offsetY;

      // future bounds of dragged card
      const projected = new Rectangle(x, y, draggedCard.width, draggedCard.height);

      for (const child of (nodeLayer as Container<ContainerChild>).children) {
        if (child === draggedCard) {
          continue;
        }

        // other card’s bounds
        const other = new Rectangle(child.x, child.y, child.width, child.height);

        if (projected.intersects(other)) {
          // --- collision resolution ---
          const projectedLeft   = projected.x;
          const projectedRight  = projected.x + projected.width;
          const projectedTop    = projected.y;
          const projectedBottom = projected.y + projected.height;

          const otherLeft   = other.x;
          const otherRight  = other.x + other.width;
          const otherTop    = other.y;
          const otherBottom = other.y + other.height;

          // how much they overlap on each axis
          const overlapX = Math.min(projectedRight, otherRight) - Math.max(projectedLeft, otherLeft);
          const overlapY = Math.min(projectedBottom, otherBottom) - Math.max(projectedTop, otherTop);

          let resolvedX = x;
          let resolvedY = y;

          if (overlapX < overlapY) {
            // slide horizontally
            if (projectedLeft < otherLeft) {
              // push to the left of `other`
              resolvedX = otherLeft - projected.width;
            } else {
              // push to the right of `other`
              resolvedX = otherRight;
            }
          } else {
            // slide vertically
            if (projectedTop < otherTop) {
              // push above `other`
              resolvedY = otherTop - projected.height;
            } else {
              // push below `other`
              resolvedY = otherBottom;
            }
          }

          // apply the “snapped” position and don’t run the normal set
          this._store.setNodePosition(id, resolvedX, resolvedY);
          return;
        }
      }

      // no collisions → just move normally
      this._store.setNodePosition(id, x, y);
    };

    this._onDragEnd = () => {
      const dragTarget = this._store.dragTarget();

      if (!dragTarget) {
        return;
      }

      viewport.off('pointermove', this._onDragMove);
      this._store.setDragTarget(null);

      const draggedCard = nodeLayer.getChildByLabel(dragTarget.id);

      if (!draggedCard) {
        return;
      }

      draggedCard.cursor = 'grab';
    };

    viewport.on('pointerup', this._onDragEnd);
    viewport.on('pointerupoutside', this._onDragEnd);

    viewport.addChild(nodeLayer);

    return nodeLayer;
  }

  private _renderNodeCard(viewport: Viewport,
                          nodeLayer: Container,
                          node: GenericNode
  ): void {
    let nodeCard: Container<ContainerChild> | null = nodeLayer.getChildByLabel(node.id);

    if (!nodeCard) {
      nodeCard = this._createNodeCard(viewport, nodeLayer, node);
    }

    this._updateNodeCardPosition(node, nodeCard);
  }

  private _createNodeCard(viewport: Viewport,
                          nodeLayer: Container,
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
      viewport.on('pointermove', this._onDragMove);
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
