import { Component } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-tinymce',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './tinymce.component.html',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TinymceComponent {
  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    toolbar:
      'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help',
    base_url: '/tinymce', // This should match the assets output path
    suffix: '.min',
    height: 300,
    menubar: false,
    promotion: false,
    skin: 'oxide',
    content_css: 'default',
  };
}
