import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-to-the-top.html',
  styleUrls: ['./back-to-the-top.css'],
})
export class BackToTopComponent {
  private document = inject(DOCUMENT);
  showButton = false;
  private scrollThreshold = 50; // Show button after 400px of scroll

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showButton = window.scrollY > this.scrollThreshold;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
