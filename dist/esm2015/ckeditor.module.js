/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFPekQsTUFBTSxPQUFPLGNBQWM7OztZQUwxQixRQUFRLFNBQUU7Z0JBQ1YsT0FBTyxFQUFFLENBQUUsV0FBVyxFQUFFLFlBQVksQ0FBRTtnQkFDdEMsWUFBWSxFQUFFLENBQUUsaUJBQWlCLENBQUU7Z0JBQ25DLE9BQU8sRUFBRSxDQUFFLGlCQUFpQixDQUFFO2FBQzlCOztBQUdELGNBQWMsWUFBWSxDQUFDO0FBQzNCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMSwgQ0tTb3VyY2UgLSBGcmVkZXJpY28gS25hYmJlbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxuICovXG5cbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBDS0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY2tlZGl0b3IuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKCB7XG5cdGltcG9ydHM6IFsgRm9ybXNNb2R1bGUsIENvbW1vbk1vZHVsZSBdLFxuXHRkZWNsYXJhdGlvbnM6IFsgQ0tFZGl0b3JDb21wb25lbnQgXSxcblx0ZXhwb3J0czogWyBDS0VkaXRvckNvbXBvbmVudCBdXG59IClcbmV4cG9ydCBjbGFzcyBDS0VkaXRvck1vZHVsZSB7XG59XG5leHBvcnQgKiBmcm9tICcuL2NrZWRpdG9yJztcbmV4cG9ydCB7IENLRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9ja2VkaXRvci5jb21wb25lbnQnO1xuIl19