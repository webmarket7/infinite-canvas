import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  ElementRef,
  ViewChild,
  InputSignal,
  effect, signal, WritableSignal
} from '@angular/core';
import { Viewport } from 'pixi-viewport';
import { Application, Container, ContainerChild, Renderer } from 'pixi.js';
import JSONCanvas, { GenericNode } from '@trbn/jsoncanvas';

import { INFINITE_CANVAS_PROVIDERS } from './infinite-canvas.providers';

import { InfiniteCanvasPixiApplicationService } from './pixi-application';
import { InfiniteCanvasViewportService } from './viewport';
import { InfiniteCanvasGridService } from './grid';
import { InfiniteCanvasNodeRendererService } from './node-renderer';


@Component({
  selector: 'app-infinite-canvas',
  imports: [],
  templateUrl: './infinite-canvas.component.html',
  styleUrl: './infinite-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ...INFINITE_CANVAS_PROVIDERS
  ],
})
export class InfiniteCanvasComponent implements AfterViewInit {
  readonly app: WritableSignal<Application<Renderer> | null> = signal<Application<Renderer> | null>(null);
  readonly viewport: WritableSignal<Viewport | null> = signal<Viewport | null>(null);
  readonly gridLayer: WritableSignal<Container | null> = signal<Container | null>(null);
  readonly nodeLayer: WritableSignal<Container | null> = signal<Container | null>(null);

  readonly doc: InputSignal<JSONCanvas | undefined> = input<JSONCanvas>();

  @ViewChild('canvasContainer', { static: true }) private _host!: ElementRef<HTMLDivElement>;

  constructor(
    private _pixiApplicationService: InfiniteCanvasPixiApplicationService,
    private _viewportService: InfiniteCanvasViewportService,
    private _gridService: InfiniteCanvasGridService,
    private _nodeRendererService: InfiniteCanvasNodeRendererService
  ) {
    effect(() => {
      const doc: JSONCanvas | undefined = this.doc();
      const nodeLayer: Container | null = this.nodeLayer();

      if (!nodeLayer || !doc) {
        return;
      }

      this._nodeRendererService.render(nodeLayer, doc.getNodes());
    });
  }

  async ngAfterViewInit(): Promise<void> {
    const app: Application<Renderer> = await this._pixiApplicationService.init(this._host);
    const viewport: Viewport = this._viewportService.create(app);
    const gridLayer = new Container();

    const nodeLayer = new Container();

    nodeLayer.eventMode = 'static';
    nodeLayer.hitArea = app.screen;

    viewport.addChild(
      gridLayer,
      nodeLayer
    );

    this._gridService.attach(app, gridLayer, viewport);

    this.gridLayer.set(gridLayer);
    this.nodeLayer.set(nodeLayer);
    this.viewport.set(viewport);
    this.app.set(app);
  }
}
