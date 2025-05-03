import { computed, Injectable, Signal } from '@angular/core';
import JSONCanvas, { GenericNode } from '@trbn/jsoncanvas';
import { ImmutableStore } from 'signalstory';
import { produce } from 'immer';

import { DragTarget } from '../models/drag-target.model';


export interface InfiniteCanvasData {
  doc: JSONCanvas | null;
}

export interface InfiniteCanvasUI {
  dragTarget: DragTarget | null;
}

export type InfiniteCanvasState = InfiniteCanvasData & InfiniteCanvasUI;

@Injectable()
export class InfiniteCanvasStore extends ImmutableStore<InfiniteCanvasState> {
  get doc(): Signal<JSONCanvas | null> {
    return computed(() => this.state().doc as JSONCanvas | null);
  }

  get dragTarget(): Signal<DragTarget | null> {
    return computed(() => this.state().dragTarget);
  }

  constructor() {
    super({
      initialState: {
        doc: null,
        dragTarget: null
      },
      mutationProducerFn: produce
    });
  }

  setInitialDoc(doc: JSONCanvas | undefined): void {
    this.mutate((state: InfiniteCanvasState) => {
      state.doc = doc ?? null;
    }, 'SetInitialDoc');
  }

  setNodePosition(nodeId: string, x: number, y: number): void {
    this.mutate((state: InfiniteCanvasState): void => {
      const doc: JSONCanvas | null = state.doc;

      if (!doc) {
        return;
      }

      const fresh: JSONCanvas = JSONCanvas.fromString(JSON.stringify(doc));
      const node: GenericNode | undefined = fresh.getNode(nodeId);

      if (!node) {
        return;
      }

      node.x = x;
      node.y = y;

      state.doc = fresh;
    }, 'SetNodePosition');
  }

  setDragTarget(dragTarget: DragTarget | null): void {
    this.mutate((state: InfiniteCanvasState) => {
      state.dragTarget = dragTarget;
    }, 'SetDragTarget');
  }
}
