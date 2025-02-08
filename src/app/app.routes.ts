import { Routes } from '@angular/router';
import { PostsComponent } from './components/posts/posts.component';
import { PostComponent } from './components/post/post.component';
import { TinymceComponent } from './components/tinymce/tinymce.component';

export const routes: Routes = [
  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: 'post/:id',
    component: PostComponent,
  },
  {
    path: 'tinymce',
    component: TinymceComponent,
  },
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
];
