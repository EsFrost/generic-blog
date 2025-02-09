import { Routes } from '@angular/router';
import { PostsComponent } from './components/posts/posts.component';
import { PostComponent } from './components/post/post.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { AuthGuard } from './auth.guard';

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
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'posts/edit/:id',
    component: EditPostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'posts/new',
    component: NewPostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
];
