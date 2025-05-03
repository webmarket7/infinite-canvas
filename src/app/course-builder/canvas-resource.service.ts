import { Injectable, computed, Signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { JSONCanvas } from '@trbn/jsoncanvas';


@Injectable({ providedIn: 'root' })
export class CanvasResourceService {
  private readonly _resource: HttpResourceRef<JSONCanvas | undefined> = httpResource(
    '/mocks/json-canvas.json',
    {
      parse: (raw: unknown): JSONCanvas | undefined => {
        let jsonCanvas: JSONCanvas | undefined = undefined;

        try {
          jsonCanvas = JSONCanvas.fromString(JSON.stringify(raw));
        } catch (e) {
          console.error('Error parsing JSONCanvas:', e);
        }

        return jsonCanvas;
      }
    });

  readonly doc: Signal<JSONCanvas | undefined> = computed(() => this._resource.value());
  readonly loading: Signal<boolean> = computed(() => this._resource.isLoading());
  readonly error: Signal<unknown | null> = computed(() => this._resource.error() ?? null);
}
