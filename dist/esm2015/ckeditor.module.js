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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2Nrc291cmNlL1dvcmtzcGFjZS9DS0VkaXRvcjQvY2tlZGl0b3I0LWFuZ3VsYXIvc3JjL2NrZWRpdG9yLyIsInNvdXJjZXMiOlsiY2tlZGl0b3IubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQU96RCxNQUFNLE9BQU8sY0FBYzs7O1lBTDFCLFFBQVEsU0FBRTtnQkFDVixPQUFPLEVBQUUsQ0FBRSxXQUFXLEVBQUUsWUFBWSxDQUFFO2dCQUN0QyxZQUFZLEVBQUUsQ0FBRSxpQkFBaUIsQ0FBRTtnQkFDbkMsT0FBTyxFQUFFLENBQUUsaUJBQWlCLENBQUU7YUFDOUI7O0FBR0QsY0FBYyxZQUFZLENBQUM7QUFDM0IsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDIxLCBDS1NvdXJjZSAtIEZyZWRlcmljbyBLbmFiYmVuLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQuXG4gKi9cblxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IENLRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9ja2VkaXRvci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoIHtcblx0aW1wb3J0czogWyBGb3Jtc01vZHVsZSwgQ29tbW9uTW9kdWxlIF0sXG5cdGRlY2xhcmF0aW9uczogWyBDS0VkaXRvckNvbXBvbmVudCBdLFxuXHRleHBvcnRzOiBbIENLRWRpdG9yQ29tcG9uZW50IF1cbn0gKVxuZXhwb3J0IGNsYXNzIENLRWRpdG9yTW9kdWxlIHtcbn1cbmV4cG9ydCAqIGZyb20gJy4vY2tlZGl0b3InO1xuZXhwb3J0IHsgQ0tFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NrZWRpdG9yLmNvbXBvbmVudCc7XG4iXX0=