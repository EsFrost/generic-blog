import { ApiService } from '../api/api.service';
import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './posts.component.html',
})
export class PostsComponent {
  private apiService = inject(ApiService);
  data$ = this.apiService.getData();
}
