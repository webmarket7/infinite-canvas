import { InjectionToken } from '@angular/core';


export interface InfiniteCanvasViewportConfig {
  zoomMin: number;
  zoomMax: number;
  dragFactor: number;
  wheelPercent: number;
  wheelSmooth: number | false;
  inertFriction: number;
  inertCutoff: number;
  wheelKeys: string[];
}

export const INFINITE_CANVAS_VIEWPORT_CONFIG =
  new InjectionToken<InfiniteCanvasViewportConfig>('INFINITE_CANVAS_VIEWPORT_CONFIG');

export const DEFAULT_INFINITE_CANVAS_VIEWPORT_CONFIG: InfiniteCanvasViewportConfig = {
  zoomMin: 0.5,
  zoomMax: 2,
  dragFactor: 0.75,
  wheelPercent: 0.05,
  wheelSmooth: 3,
  inertFriction: 0.82,
  inertCutoff: 0.05,
  wheelKeys: [ 'ControlLeft', 'ControlRight' ],
};
