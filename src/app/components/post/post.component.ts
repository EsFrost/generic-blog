import { ApiService } from '../../api/api.service';
import { Component, inject, SecurityContext } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    map((params: Params) => params['id']),
    switchMap((id: string) => this.apiService.getPostById(id))
  );

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
