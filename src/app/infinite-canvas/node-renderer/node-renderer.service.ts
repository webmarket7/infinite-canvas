import { Injectable } from '@angular/core';
import { Container, ContainerChild, FederatedPointerEvent, Graphics, Renderer } from 'pixi.js';
import JSONCanvas, { GenericNode } from '@trbn/jsoncanvas';


enum CanvasColor {
  RED = 1,
  ORANGE = 2,
  YELLOW = 3,
  GREEN = 4,
  CYAN = 5,
  PURPLE = 6
}

const CANVAS_COLORS_MAP = {
  [CanvasColor.RED]: '#CD1C18',
  [CanvasColor.ORANGE]: '#FF7F00',
  [CanvasColor.YELLOW]: '#FFCE1B',
  [CanvasColor.GREEN]: '#008000',
  [CanvasColor.CYAN]: '#00BFFF',
  [CanvasColor.PURPLE]: '#A020F0'
}

@Injectable()
export class InfiniteCanvasNodeRendererService {

  render(targetLayer: Container, doc: JSONCanvas): void {
    targetLayer.removeChildren();

    /* ▲  Store offset inside the closure so each sprite has its own value */
    let dragTarget: ContainerChild | null = null;
    let offsetX = 0;
    let offsetY = 0;

    const onDragMove = (e: FederatedPointerEvent) => {
      if (!dragTarget) return;
      /** pointer coords converted to targetLayer's parent space */
      const pos = e.getLocalPosition(dragTarget.parent);
      dragTarget.position.set(pos.x + offsetX, pos.y + offsetY);
    };

    const onDragEnd = () => {
      if (dragTarget) {
        targetLayer.off('pointermove', onDragMove);
        dragTarget.cursor = 'grab';
        dragTarget = null;
      }
    };

    doc.getNodes().forEach(node => {
      const sprite = this._makeSprite(node);
      if (!sprite) return;

      sprite.eventMode = 'static';        // v8 replacement for interactive=true :contentReference[oaicite:1]{index=1}
      sprite.cursor    = 'grab';

      sprite.on('pointerdown', (e: FederatedPointerEvent) => {
        /** ▲ Calculate offset between pointer and sprite origin once */
        const startPos = e.getLocalPosition(sprite.parent);
        offsetX = sprite.x - startPos.x;
        offsetY = sprite.y - startPos.y;

        sprite.cursor = 'grabbing';
        dragTarget = sprite;
        targetLayer.on('pointermove', onDragMove);
      });

      targetLayer.addChild(sprite);
    });

    targetLayer.on('pointerup',         onDragEnd);
    targetLayer.on('pointerupoutside',  onDragEnd);
  }

  private _makeSprite(node: GenericNode): ContainerChild | null {
    const wrapper = new Container();

    wrapper.position.set(node.x, node.y);
    wrapper.label = node.id;

    const color: CanvasColor = node.color ?? CanvasColor.YELLOW;
    const graphics: Graphics = new Graphics()
      .roundRect(0, 0, node.width, node.height, 6)
      .fill(this._hex(CANVAS_COLORS_MAP[color]));

    wrapper.addChild(graphics);

    return wrapper;
  }

  /** Converts CSS‐style color strings to hex numbers for Pixi. */
  private _hex(cssColor: string): number {
    return Number(`0x${ cssColor.replace('#', '') }`);
  }
}
