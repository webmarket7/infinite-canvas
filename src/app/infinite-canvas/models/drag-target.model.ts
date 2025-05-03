import { Point } from 'pixi.js';


export interface DragTarget {
  id: string;
  pickupPositionInCanvas: Point;
  pickupPositionInElement: Point;
}
