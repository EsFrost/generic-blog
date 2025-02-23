import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TINYMCE_SCRIPT_SRC, EditorComponent } from '@tinymce/tinymce-angular';
import { ApiService } from '../../api/api.service';
import { Category } from '../../utils/interfaces';
import { TINYMCE_DEFAULT_CONFIG } from '../../utils/editor-config';
import { Editor } from 'tinymce';

declare const tinymce: any;

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: '/tinymce/tinymce.min.js' },
  ],
  templateUrl: './new-post.component.html',
})
export class NewPostComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private editorInstance: Editor | null = null;

  title: string = '';
  content: string = '';
  imageUrl: string = '';
  imageError: boolean = false;
  previewUrl: string = '';
  categories: Category[] = [];
  selectedCategoryIds: Set<string> = new Set<string>();
  isSubmitting = false;

  tinymceInit: EditorComponent['init'] = {
    ...TINYMCE_DEFAULT_CONFIG,
    setup: (editor: Editor) => {
      this.editorInstance = editor;
      editor.on('init', () => {
        const container = editor.getContainer();
        if (container) {
          container.style.transition = 'border-color 0.15s ease-in-out';
        }
      });
    },
  };

  ngOnInit() {
    this.loadCategories();
  }

  ngOnDestroy() {
    if (this.editorInstance) {
      this.editorInstance.remove();
      this.editorInstance = null;
    }
  }

  loadCategories() {
    this.apiService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  async savePost() {
    if (!this.title.trim() || !this.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    this.isSubmitting = true;

    try {
      const response = await this.apiService
        .createPost({
          title: this.title,
          content: this.content,
          image_url: this.imageUrl,
        })
        .toPromise();

      if (!response?.id) {
        throw new Error('No post ID received');
      }

      await this.addCategoriesToPost(response.id);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async addCategoriesToPost(postId: string) {
    if (this.selectedCategoryIds.size === 0) return;

    const categoryIds = Array.from(this.selectedCategoryIds);

    for (const categoryId of categoryIds) {
      try {
        await this.apiService.addCategoryToPost(postId, categoryId).toPromise();
      } catch (error) {
        console.error(`Error adding category ${categoryId}:`, error);
      }
    }
  }

  updatePreviewUrl() {
    this.previewUrl = this.imageUrl;
  }

  clearImage() {
    this.imageUrl = '';
    this.previewUrl = '';
    this.imageError = false;
  }

  handleImageError() {
    this.imageError = true;
  }

  onCategoryToggle(categoryId: string) {
    if (this.selectedCategoryIds.has(categoryId)) {
      this.selectedCategoryIds.delete(categoryId);
    } else {
      this.selectedCategoryIds.add(categoryId);
    }
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategoryIds.has(categoryId);
  }
}
