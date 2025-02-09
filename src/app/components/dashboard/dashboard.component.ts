import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private apiService = inject(ApiService);
  posts$ = this.apiService.getAllPosts();
  router: any;

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
}
