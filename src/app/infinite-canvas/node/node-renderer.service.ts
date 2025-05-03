import { Injectable } from '@angular/core';
import { Container, ContainerChild, Graphics } from 'pixi.js';
import { GenericNode } from '@trbn/jsoncanvas';


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
  createNodeCard(node: GenericNode): Container<ContainerChild> {
    const wrapper = new Container();

    wrapper.position.set(node.x, node.y);
    wrapper.label = node.id;

    const color: CanvasColor = node.color ?? CanvasColor.YELLOW;
    const graphics: Graphics = new Graphics()
      .roundRect(0, 0, node.width, node.height, 6)
      .fill(toHex(CANVAS_COLORS_MAP[color]));

    wrapper.addChild(graphics);

    return wrapper;
  }
}

function toHex(color: string): number {
  return Number(`0x${ color.replace('#', '') }`);
}
