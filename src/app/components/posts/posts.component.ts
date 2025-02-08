import { ApiService } from '../../api/api.service';
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './posts.component.html',
})
export class PostsComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);
  data$ = this.apiService.getAllPosts();

  getPreview(content: string): string {
    const plainText = content.replace(/<[^>]*>/g, ''); // remove html tags
    return plainText.length > 200
      ? plainText.substring(0, 200) + '...'
      : plainText;
  }

  navigateToPost(id: number): void {
    this.router.navigate(['/post', id]);
  }
}
