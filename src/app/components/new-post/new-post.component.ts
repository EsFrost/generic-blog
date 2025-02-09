import { Component, ElementRef, ViewChild, inject } from '@angular/core';
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

  @ViewChild('fileInput') fileInput!: ElementRef;

  title: string = '';
  content: string = '';
  imageUrl: string = '';
  imageError: boolean = false;
  imageMode: 'url' | 'upload' = 'url';
  selectedFile: File | null = null;
  previewUrl: string = '';

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.createImagePreview();
    }
  }

  createImagePreview() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updatePreviewUrl() {
    if (this.imageMode === 'url') {
      this.previewUrl = this.imageUrl;
    } else if (this.selectedFile) {
      this.createImagePreview();
    }
  }

  clearImage() {
    this.imageUrl = '';
    this.previewUrl = '';
    this.imageError = false;
  }

  clearFile() {
    this.selectedFile = null;
    this.previewUrl = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  handleImageError() {
    this.imageError = true;
  }

  async savePost() {
    if (!this.title.trim() || !this.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    let finalImageUrl = this.imageUrl;

    // If using file upload and a file is selected, handle the upload first
    if (this.imageMode === 'upload' && this.selectedFile) {
      try {
        const uploadResponse = await this.apiService
          .uploadImage(this.selectedFile)
          .toPromise();
        finalImageUrl = uploadResponse.path;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    console.log('finalImageUrl:', finalImageUrl);

    this.apiService
      .createPost({
        title: this.title,
        content: this.content,
        image_url: finalImageUrl,
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
