import { Routes } from '@angular/router';
import { PostsComponent } from './components/posts/posts.component';
import { PostComponent } from './components/post/post.component';

export const routes: Routes = [
  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: 'post',
    component: PostComponent,
  },
];
