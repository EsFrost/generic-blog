import { ApiService } from '../../api/api.service';
import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';
import { Category } from '../../utils/interfaces';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  categories?: Category[];
}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  post$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) =>
      combineLatest({
        post: this.apiService.getPostById(id),
        categories: this.apiService.getPostCategories(id),
      })
    ),
    map(
      ({ post, categories }) =>
        ({
          ...post,
          categories,
        } as Post)
    )
  );

  imageUrl: SafeUrl = '';

  ngOnInit() {
    this.post$.subscribe((post) => {
      if (post.image_url) {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(post.image_url);
      }
    });
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
