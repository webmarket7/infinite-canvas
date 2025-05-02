import { InjectionToken } from '@angular/core';


export interface InfiniteCanvasPixiApplicationConfig {
  background : number;
  autoDensity: boolean;
}

export const INFINITE_CANVAS_PIXI_APPLICATION_CONFIG = new InjectionToken<InfiniteCanvasPixiApplicationConfig>('INFINITE_CANVAS_PIXI_APPLICATION_CONFIG');

export const DEFAULT_INFINITE_CANVAS_PIXI_APPLICATION_CONFIG: InfiniteCanvasPixiApplicationConfig = {
  background : 0xffffff,
  autoDensity: true,
};
