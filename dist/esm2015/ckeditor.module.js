/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorComponent } from './ckeditor.component';
export class CKEditorModule {
}
CKEditorModule.decorators = [
    { type: NgModule, args: [{
                imports: [FormsModule, CommonModule],
                declarations: [CKEditorComponent],
                exports: [CKEditorComponent]
            },] }
];
export * from './ckeditor';
export { CKEditorComponent } from './ckeditor.component';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFPekQsTUFBTSxPQUFPLGNBQWM7OztZQUwxQixRQUFRLFNBQUU7Z0JBQ1YsT0FBTyxFQUFFLENBQUUsV0FBVyxFQUFFLFlBQVksQ0FBRTtnQkFDdEMsWUFBWSxFQUFFLENBQUUsaUJBQWlCLENBQUU7Z0JBQ25DLE9BQU8sRUFBRSxDQUFFLGlCQUFpQixDQUFFO2FBQzlCOztBQUdELGNBQWMsWUFBWSxDQUFDO0FBQzNCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMiwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZC5cbiAqL1xuXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQ0tFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NrZWRpdG9yLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSgge1xuXHRpbXBvcnRzOiBbIEZvcm1zTW9kdWxlLCBDb21tb25Nb2R1bGUgXSxcblx0ZGVjbGFyYXRpb25zOiBbIENLRWRpdG9yQ29tcG9uZW50IF0sXG5cdGV4cG9ydHM6IFsgQ0tFZGl0b3JDb21wb25lbnQgXVxufSApXG5leHBvcnQgY2xhc3MgQ0tFZGl0b3JNb2R1bGUge1xufVxuZXhwb3J0ICogZnJvbSAnLi9ja2VkaXRvcic7XG5leHBvcnQgeyBDS0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY2tlZGl0b3IuY29tcG9uZW50JztcbiJdfQ==