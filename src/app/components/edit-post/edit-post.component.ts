import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TINYMCE_SCRIPT_SRC, EditorComponent } from '@tinymce/tinymce-angular';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  templateUrl: './edit-post.component.html',
})
export class EditPostComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  postId: string = '';
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

  ngOnInit() {
    this.postId = this.route.snapshot.params['id'];
    if (this.postId) {
      this.loadPost();
    }
  }

  private loadPost() {
    this.apiService.getPostById(this.postId).subscribe({
      next: (post) => {
        this.title = post.title;
        this.content = post.content;
        this.imageUrl = post.image_url || '';
        this.imageError = false;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.router.navigate(['/dashboard']);
      },
    });
  }

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
      .editPost(this.postId, {
        title: this.title,
        content: this.content,
        image_url: this.imageUrl,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error saving post:', error);
          alert('Failed to save post. Please try again.');
        },
      });
  }

  deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.apiService.deletePost(this.postId).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. Please try again.');
        },
      });
    }
  }
}
