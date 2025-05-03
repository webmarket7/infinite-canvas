import { ChangeDetectionStrategy, Component } from '@angular/core';

import { InfiniteCanvasComponent } from '../infinite-canvas';
import { CanvasResourceService } from './canvas-resource.service';


@Component({
  selector: 'app-course-builder',
  imports: [
    InfiniteCanvasComponent
  ],
  templateUrl: './course-builder.component.html',
  styleUrl: './course-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseBuilderComponent {
  constructor(public canvasResource: CanvasResourceService) { }
}
