# Markdown Editor


## v0.1

#### Requirements

* [REQ1] Markdown pages can be rendered as HTML.
* [REQ2] Markdown editor and HTML preview is synchronized automatically.
* [REQ3] Markdown editor inputs are sanitized from harmful inputs.
* [REQ4] Users can adjust the page column width for Markdown editor and HTML preview.

#### Design

| ![](imgs/image.png) |
| :---: |
| v0.1 wireframe |

## v0.2

#### Requirements

* [REQ5] Users can open files from the file system.
* [REQ6] Users can save the changes to the file back to the file system.
* [REQ7] Rendered HTML can be exported.
* [REQ8] Rendered HTML can be copied to clipboard.

**Document drag-and-drop functionality**
* [REQ9] Files can be dragged over to the markdown editor.
* [REQ10] Plain text and markdown files can be dragged-and-dropped.
* [REQ11] When a file is being dragged, the user can see visual indication of whether the operation will be successful or not.

**Change Detection**
* [REQ12] Any changes to the file by external tools should be tracked.
* [REQ13] If file has no unsaved changes, file change should replace the content with latest one. 