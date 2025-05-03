import { InfiniteCanvasStore } from './state';
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
  InfiniteCanvasGridLayerService,
  InfiniteCanvasGridRendererService,
} from './grid';
import { InfiniteCanvasEdgeLayerService, InfiniteCanvasEdgeRendererService } from './edge';
import { InfiniteCanvasNodeLayerService, InfiniteCanvasNodeRendererService } from './node';
import { InfiniteCanvasService } from './infinite-canvas.service';


export const INFINITE_CANVAS_PROVIDERS = [
  { provide: INFINITE_CANVAS_PIXI_APPLICATION_CONFIG, useValue: DEFAULT_INFINITE_CANVAS_PIXI_APPLICATION_CONFIG },
  { provide: INFINITE_CANVAS_VIEWPORT_CONFIG, useValue: DEFAULT_INFINITE_CANVAS_VIEWPORT_CONFIG },
  { provide: INFINITE_CANVAS_GRID_CONFIG, useValue: DEFAULT_INFINITE_CANVAS_GRID_CONFIG },
  InfiniteCanvasStore,
  InfiniteCanvasPixiApplicationService,
  InfiniteCanvasViewportService,
  InfiniteCanvasGridLayerService,
  InfiniteCanvasGridRendererService,
  InfiniteCanvasNodeLayerService,
  InfiniteCanvasNodeRendererService,
  InfiniteCanvasEdgeLayerService,
  InfiniteCanvasEdgeRendererService,
  InfiniteCanvasService
];
