import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TINYMCE_SCRIPT_SRC, EditorComponent } from '@tinymce/tinymce-angular';
import { ApiService } from '../../api/api.service';
import { Category } from '../../utils/interfaces';
import { forkJoin, Observable } from 'rxjs';

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
  previewUrl: string = '';
  categories: Category[] = [];
  selectedCategoryIds: Set<string> = new Set<string>();

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
    base_url: '/tinymce',
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
      this.loadData();
    }
  }

  private loadData() {
    // Load both post data and categories in parallel
    forkJoin({
      post: this.apiService.getPostById(this.postId),
      categories: this.apiService.getAllCategories(),
      postCategories: this.apiService.getPostCategories(this.postId),
    }).subscribe({
      next: (data) => {
        // Set post data
        this.title = data.post.title;
        this.content = data.post.content;
        this.imageUrl = data.post.image_url || '';
        this.updatePreviewUrl();

        // Set categories
        this.categories = data.categories;

        // Set selected categories
        this.selectedCategoryIds = new Set(
          data.postCategories.map((cat: Category) => cat.id)
        );
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.router.navigate(['/dashboard']);
      },
    });
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

  savePost() {
    if (!this.title.trim() || !this.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    // First update the post details
    this.apiService
      .editPost(this.postId, {
        title: this.title,
        content: this.content,
        image_url: this.imageUrl,
      })
      .subscribe({
        next: () => {
          // After post is updated, handle categories
          this.updateCategories();
        },
        error: (error) => {
          console.error('Error saving post:', error);
          alert('Failed to save post. Please try again.');
        },
      });
  }

  private updateCategories() {
    // Get current categories for comparison
    this.apiService.getPostCategories(this.postId).subscribe({
      next: (currentCategories: Category[]) => {
        const currentCategoryIds = new Set(
          currentCategories.map((cat) => cat.id)
        );
        const selectedCategoryIds = this.selectedCategoryIds;

        const categoriesToAdd = Array.from(selectedCategoryIds).filter(
          (id) => !currentCategoryIds.has(id)
        );
        const categoriesToRemove = Array.from(currentCategoryIds).filter(
          (id) => !selectedCategoryIds.has(id)
        );

        const operations: Array<any> = [];

        // Add new categories
        for (const categoryId of categoriesToAdd) {
          operations.push(
            this.apiService.addCategoryToPost(this.postId, categoryId)
          );
        }

        // Remove unselected categories
        for (const categoryId of categoriesToRemove) {
          operations.push(
            this.apiService.removeCategoryFromPost(this.postId, categoryId)
          );
        }

        if (operations.length > 0) {
          // Convert array of operations into an object for forkJoin
          const operationsObj = operations.reduce((acc, operation, index) => {
            acc[`operation${index}`] = operation;
            return acc;
          }, {} as { [key: string]: Observable<any> });

          forkJoin(operationsObj).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (error) => {
              console.error('Error updating categories:', error);
              alert('Post saved but there was an error updating categories.');
              this.router.navigate(['/dashboard']);
            },
          });
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error getting current categories:', error);
        this.router.navigate(['/dashboard']);
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
