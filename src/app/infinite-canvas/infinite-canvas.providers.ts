import {
  DEFAULT_INFINITE_CANVAS_PIXI_APPLICATION_CONFIG,
  INFINITE_CANVAS_PIXI_APPLICATION_CONFIG, InfiniteCanvasPixiApplicationService
} from './pixi-application';
import {
  INFINITE_CANVAS_VIEWPORT_CONFIG,
  DEFAULT_INFINITE_CANVAS_VIEWPORT_CONFIG, InfiniteCanvasViewportService
} from './viewport';
import {
  DEFAULT_INFINITE_CANVAS_GRID_CONFIG,
  INFINITE_CANVAS_GRID_CONFIG,
  InfiniteCanvasGridService,
} from './grid';
import { InfiniteCanvasNodeRendererService } from './node-renderer';
import { InfiniteCanvasEdgeRendererService } from './edge-renderer';


export const INFINITE_CANVAS_PROVIDERS = [
  { provide: INFINITE_CANVAS_PIXI_APPLICATION_CONFIG, useValue: DEFAULT_INFINITE_CANVAS_PIXI_APPLICATION_CONFIG },
  { provide: INFINITE_CANVAS_VIEWPORT_CONFIG, useValue: DEFAULT_INFINITE_CANVAS_VIEWPORT_CONFIG },
  { provide: INFINITE_CANVAS_GRID_CONFIG, useValue: DEFAULT_INFINITE_CANVAS_GRID_CONFIG },
  InfiniteCanvasPixiApplicationService,
  InfiniteCanvasViewportService,
  InfiniteCanvasGridService,
  InfiniteCanvasNodeRendererService,
  InfiniteCanvasEdgeRendererService,
];
