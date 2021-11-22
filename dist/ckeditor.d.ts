/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
/**
 * Basic typings for the CKEditor4 elements.
 */
export declare namespace CKEditor4 {
    /**
     * The CKEditor4 editor constructor.
     */
    interface Config {
        [key: string]: any;
    }
    /**
     * The CKEditor4 editor.
     */
    interface Editor {
        [key: string]: any;
    }
    /**
     * The CKEditor4 editor interface type.
     * See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_uitypes.html
     * to learn more.
     */
    const enum EditorType {
        INLINE = "inline",
        CLASSIC = "classic"
    }
    /**
     * The event object passed to CKEditor4 event callbacks.
     *
     * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_eventInfo.html
     * to learn more.
     */
    interface EventInfo {
        readonly name: string;
        readonly editor: any;
        readonly data: {
            [key: string]: any;
        };
        readonly listenerData: {
            [key: string]: any;
        };
        readonly sender: {
            [key: string]: any;
        };
        cancel(): void;
        removeListener(): void;
        stop(): void;
    }
}
