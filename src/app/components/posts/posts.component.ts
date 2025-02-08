import { ApiService } from '../../api/api.service';
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './posts.component.html',
})
export class PostsComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);
  data$ = this.apiService.getAllPosts();

  getGridArea(index: number): string {
    const row = Math.floor(index / 3);
    const positionInRow = index % 3;

    if (row % 2 === 0) {
      // Even rows (0, 2, 4...)
      if (positionInRow === 0) return 'lg:col-span-1';
      if (positionInRow === 1) return 'lg:col-span-2';
    } else {
      // Odd rows (1, 3, 5...)
      if (positionInRow === 0) return 'lg:col-span-2';
      if (positionInRow === 1) return 'lg:col-span-1';
    }
    return 'lg:col-span-3';
  }

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
