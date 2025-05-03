import { Component } from '@angular/core';

import { CourseBuilderComponent } from './course-builder';


@Component({
  selector: 'app-root',
  imports: [
    CourseBuilderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
