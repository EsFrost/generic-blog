import { ApiService } from '../../api/api.service';
import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Category } from '../../utils/interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIf, FormsModule],
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  categories$ = this.apiService.getAllCategories();
  selectedCategories = new BehaviorSubject<Set<string>>(new Set());
  posts$ = new BehaviorSubject<any[]>([]);

  // Combine posts and selected categories to create filtered posts
  filteredPosts$ = combineLatest([this.posts$, this.selectedCategories]).pipe(
    map(([posts, selectedCategories]) => {
      if (selectedCategories.size === 0) return posts;

      return posts.filter((post) =>
        post.categories?.some((category: Category) =>
          selectedCategories.has(category.id)
        )
      );
    })
  );

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    try {
      const posts = await this.apiService.getAllPosts().toPromise();
      // Load categories for each post
      const postsWithCategories = await Promise.all(
        posts.map(async (post: any) => {
          const categories = await this.apiService
            .getPostCategories(post.id)
            .toPromise();
          return { ...post, categories };
        })
      );
      this.posts$.next(postsWithCategories);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  toggleCategory(categoryId: string) {
    const currentSelected = this.selectedCategories.value;
    const newSelected = new Set(currentSelected);

    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }

    this.selectedCategories.next(newSelected);
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.value.has(categoryId);
  }

  getGridArea(index: number): string {
    const row = Math.floor(index / 3);
    const positionInRow = index % 3;

    if (row % 2 === 0) {
      if (positionInRow === 0) return 'lg:col-span-1';
      if (positionInRow === 1) return 'lg:col-span-2';
    } else {
      if (positionInRow === 0) return 'lg:col-span-2';
      if (positionInRow === 1) return 'lg:col-span-1';
    }
    return 'lg:col-span-3';
  }

  getPreview(content: string): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 200
      ? plainText.substring(0, 200) + '...'
      : plainText;
  }

  navigateToPost(id: number): void {
    this.router.navigate(['/post', id]);
  }
}
