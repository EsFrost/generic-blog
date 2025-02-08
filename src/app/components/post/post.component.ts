import { ApiService } from '../../api/api.service';
import { Component, inject, SecurityContext } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './post.component.html',
})
export class PostComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  post$ = this.route.params.pipe(
    map((params: Params) => params['id']),
    switchMap((id: string) => this.apiService.getPostById(id))
  );

  sanitizeContent(content: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, content) || '';
  }
}
