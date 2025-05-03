import { Injectable } from '@angular/core';
import { Container, Graphics } from 'pixi.js';
import { JSONCanvas, Edge, GenericNode } from '@trbn/jsoncanvas';

interface Point { x: number; y: number; }

@Injectable()
export class InfiniteCanvasEdgeRendererService {
  render(layer: Container, doc: JSONCanvas): void {
    layer.removeChildren();

    // map nodes by id
    const nodes = Object.fromEntries(
      doc.getNodes().map(n => [n.id, n] as const)
    );

    for (const edge of doc.getEdges()) {
      const from = nodes[edge.fromNode];
      const to   = nodes[edge.toNode];
      if (!from || !to) continue;

      // 1) anchors
      const anchorsA = this._getAnchors(from);
      const anchorsB = this._getAnchors(to);

      // 2) pick closest side-centers
      let best: { dist: number; a: Point | null; b: Point | null } = {
        dist: Infinity, a: null, b: null
      };
      for (const pa of anchorsA) {
        for (const pb of anchorsB) {
          const d = Math.abs(pa.x - pb.x) + Math.abs(pa.y - pb.y);
          if (d < best.dist) best = { dist: d, a: pa, b: pb };
        }
      }
      if (!best.a || !best.b) continue;
      const pa = best.a, pb = best.b;

      // 3) start circle
      layer.addChild(
        new Graphics()
          .circle(pa.x, pa.y, 5)     // deprecated-free circle API
          .fill(0x000000)            // modern fill()
      );

      // 4) draw orthogonal path
      const horizontalFirst =
        Math.abs(pa.x - pb.x) >= Math.abs(pa.y - pb.y);

      const line = new Graphics()
        .setStrokeStyle({ width: 2, color: 0x000000 })
        .moveTo(pa.x, pa.y);

      if (horizontalFirst) {
        line.lineTo(pb.x, pa.y).lineTo(pb.x, pb.y);
      } else {
        line.lineTo(pa.x, pb.y).lineTo(pb.x, pb.y);
      }
      line.stroke();
      layer.addChild(line);

      // 5) arrowhead at pb, aligned to last segment
      this._drawArrowhead(layer, pa, pb, horizontalFirst);
    }
  }

  /** 4 points: top/bottom/left/right centers of a node. */
  private _getAnchors(n: GenericNode): Point[] {
    return [
      { x: n.x + n.width/2, y: n.y           }, // top
      { x: n.x + n.width/2, y: n.y + n.height }, // bottom
      { x: n.x           , y: n.y + n.height/2 }, // left
      { x: n.x + n.width , y: n.y + n.height/2 }  // right
    ];
  }

  /**
   * Draws a triangular arrowhead at `end`, pointing along the
   * last segment direction (orthogonal only).
   */
  private _drawArrowhead(
    layer: Container,
    start: Point,
    end:   Point,
    horizontalFirst: boolean
  ): void {
    const size = 10;  // length of the arrow “shaft”
    const wing = 6;   // half-width of the triangle base
    let pts: number[];

    if (horizontalFirst) {
      // last segment is vertical: arrow pointing up or down
      if (end.y > start.y) {
        // pointing down
        pts = [
          end.x, end.y,              // tip
          end.x - wing, end.y - size,
          end.x + wing, end.y - size
        ];
      } else {
        // pointing up
        pts = [
          end.x, end.y,
          end.x - wing, end.y + size,
          end.x + wing, end.y + size
        ];
      }
    } else {
      // last segment is horizontal: arrow pointing left or right
      if (end.x > start.x) {
        // pointing right
        pts = [
          end.x, end.y,
          end.x - size, end.y - wing,
          end.x - size, end.y + wing
        ];
      } else {
        // pointing left
        pts = [
          end.x, end.y,
          end.x + size, end.y - wing,
          end.x + size, end.y + wing
        ];
      }
    }

    layer.addChild(
      new Graphics()
        .poly(pts)       // v8 polygon API
        .fill(0x000000)  // fill the arrowhead
    );
  }
}
