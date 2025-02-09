import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TINYMCE_SCRIPT_SRC, EditorComponent } from '@tinymce/tinymce-angular';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: '/tinymce/tinymce.min.js' },
  ],
  templateUrl: './new-post.component.html',
})
export class NewPostComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  title: string = '';
  content: string = '';
  imageUrl: string = '';
  imageError: boolean = false;

  tinymceInit: EditorComponent['init'] = {
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'code',
      'help',
      'wordcount',
    ],
    toolbar:
      'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    base_url: '/tinymce', // This should match the assets output path
    suffix: '.min',
    height: 500,
    menubar: false,
    promotion: false,
    skin: 'oxide',
    content_style:
      'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
  };

  clearImage() {
    this.imageUrl = '';
    this.imageError = false;
  }

  handleImageError() {
    this.imageError = true;
  }

  savePost() {
    if (!this.title.trim() || !this.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    this.apiService
      .createPost({
        title: this.title,
        content: this.content,
        image_url: this.imageUrl,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating post:', error);
          alert('Failed to create post. Please try again.');
        },
      });
  }
}
