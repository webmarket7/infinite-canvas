import { InjectionToken } from '@angular/core';


export interface InfiniteCanvasGridConfig {
  cellSize: number;
  dotColor: number;
  dotRadius: number;
}

export const INFINITE_CANVAS_GRID_CONFIG = new InjectionToken<InfiniteCanvasGridConfig>('INFINITE_CANVAS_GRID_CONFIG');

export const DEFAULT_INFINITE_CANVAS_GRID_CONFIG: InfiniteCanvasGridConfig = {
  cellSize: 40,
  dotColor: 0xcccccc,
  dotRadius: 2,
};
