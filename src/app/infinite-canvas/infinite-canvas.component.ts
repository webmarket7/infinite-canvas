import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnDestroy
} from '@angular/core';
import JSONCanvas from '@trbn/jsoncanvas';


import { INFINITE_CANVAS_PROVIDERS } from './infinite-canvas.providers';
import { InfiniteCanvasStore } from './state';
import { InfiniteCanvasService } from './infinite-canvas.service';


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
export class InfiniteCanvasComponent implements AfterViewInit, OnDestroy {
  @Input() set doc(doc: JSONCanvas | undefined) {
    this._store.setInitialDoc(doc);
  }

  @ViewChild('canvasContainer', { static: true }) private _host!: ElementRef<HTMLDivElement>;

  constructor(
    private _store: InfiniteCanvasStore,
    private _infiniteCanvasService: InfiniteCanvasService,
  ) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this._infiniteCanvasService.init(this._host);
  }

  ngOnDestroy(): void {
    this._infiniteCanvasService.destroy();
  }
}
