// src/app/components/dashboard/dashboard.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { PostInterface } from '../../utils/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private apiService = inject(ApiService);
  posts$ = this.apiService.getAllPosts();

  deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.apiService.deletePost(id).subscribe({
        next: () => {
          // Refresh the posts list
          this.posts$ = this.apiService.getAllPosts();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. Please try again.');
        },
      });
    }
  }
}
