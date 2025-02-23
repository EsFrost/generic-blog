import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { CreateCategoryDialogComponent } from '../create-category-dialog/craete-category-dialog.component';
import { EditCategoryDialogComponent } from '../edit-category-dialog/edit-category-dialog.component';
import { ImageService, ImageFile } from '../../api/image.service';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

type ViewType = 'posts' | 'categories' | 'images';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CreateCategoryDialogComponent,
    EditCategoryDialogComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private apiService = inject(ApiService);
  private imageService = inject(ImageService);
  private router = inject(Router);

  posts$ = this.apiService.getAllPosts();
  categories$ = this.apiService.getAllCategories();
  images: ImageFile[] = [];

  showCreateCategoryDialog = false;
  notification: Notification | null = null;
  activeView: ViewType = 'posts';
  showEditCategoryDialog = false;
  selectedCategory: { id: string; name: string } | null = null;
  isUploading = false;

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.imageService.getImages().subscribe({
      next: (response) => {
        this.images = response.files;
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.showNotification({
          message: 'Failed to load images',
          type: 'error',
        });
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadImage(input.files[0]);
    }
  }

  uploadImage(file: File) {
    this.isUploading = true;
    this.imageService.uploadImage(file).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.loadImages();
        this.showNotification({
          message: 'Image uploaded successfully!',
          type: 'success',
        });
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.isUploading = false;
        this.showNotification({
          message: 'Failed to upload image',
          type: 'error',
        });
      },
    });
  }

  deleteImage(filename: string) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.imageService.deleteImage(filename).subscribe({
        next: () => {
          this.loadImages();
          this.showNotification({
            message: 'Image deleted successfully!',
            type: 'success',
          });
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          this.showNotification({
            message: 'Failed to delete image',
            type: 'error',
          });
        },
      });
    }
  }

  copyImageUrl(url: string) {
    const fullUrl = `http://localhost:3000${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.showNotification({
        message: 'Image URL copied to clipboard!',
        type: 'success',
      });
    });
  }

  setActiveView(view: ViewType) {
    this.activeView = view;
  }

  deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.apiService.deletePost(id).subscribe({
        next: () => {
          this.posts$ = this.apiService.getAllPosts();
          this.showNotification({
            message: 'Post deleted successfully!',
            type: 'success',
          });
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          this.showNotification({
            message: 'Failed to delete post. Please try again.',
            type: 'error',
          });
        },
      });
    }
  }

  onCreateCategoryClick() {
    this.showCreateCategoryDialog = true;
  }

  handleCreateCategoryClose(success: boolean) {
    this.showCreateCategoryDialog = false;
    if (success) {
      this.showNotification({
        message: 'Category created successfully!',
        type: 'success',
      });
    } else {
      this.showNotification({
        message: 'Failed to create category. Please try again.',
        type: 'error',
      });
    }
  }

  private showNotification(notification: Notification) {
    this.notification = notification;
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => {
          this.showNotification({
            message: 'Category deleted successfully!',
            type: 'success',
          });
          this.categories$ = this.apiService.getAllCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.showNotification({
            message: 'Failed to delete category. Please try again.',
            type: 'error',
          });
        },
      });
    }
  }

  onEditCategory(category: { id: string; name: string }) {
    this.selectedCategory = category;
    this.showEditCategoryDialog = true;
  }

  handleEditCategoryClose(success: boolean) {
    this.showEditCategoryDialog = false;
    this.selectedCategory = null;
    if (success) {
      this.showNotification({
        message: 'Category updated successfully!',
        type: 'success',
      });
      this.categories$ = this.apiService.getAllCategories();
    }
  }
}
