import { ApiService } from '../../api/api.service';
import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './post.component.html',
})
export class PostComponent {
  private apiService = inject(ApiService);
  data$ = this.apiService.getPostById('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
}
