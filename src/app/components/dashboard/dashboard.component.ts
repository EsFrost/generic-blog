import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { CreateCategoryDialogComponent } from '../create-category-dialog/craete-category-dialog.component';
import { EditCategoryDialogComponent } from '../edit-category-dialog/edit-category-dialog.component';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

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
  posts$ = this.apiService.getAllPosts();
  private router = inject(Router);
  categories$ = this.apiService.getAllCategories();
  showCreateCategoryDialog = false;
  notification: Notification | null = null;
  activeView: 'posts' | 'categories' = 'posts';
  showEditCategoryDialog = false;
  selectedCategory: { id: string; name: string } | null = null;

  deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.apiService.deletePost(id).subscribe({
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
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  setActiveView(view: 'posts' | 'categories') {
    this.activeView = view;
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
