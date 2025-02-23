import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService, ImageFile } from '../../api/image.service';

interface ImageFileExtended extends ImageFile {
  sanitizedUrl?: SafeUrl;
}

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
})
export class ImageGalleryComponent {
  private imageService = inject(ImageService);
  private sanitizer = inject(DomSanitizer);

  @Output() selectImage = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  images: ImageFileExtended[] = [];
  isUploading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.imageService.getImages().subscribe({
      next: (response) => {
        this.images = response.files.map((file) => ({
          ...file,
          sanitizedUrl: this.sanitizeUrl(
            `http://localhost:3000/uploads/${
              file.name
            }?t=${new Date().getTime()}`
          ),
        }));
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.error = 'Failed to load images';
      },
    });
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadImage(input.files[0]);
    }
  }

  uploadImage(file: File) {
    this.isUploading = true;
    this.error = null;

    this.imageService.uploadImage(file).subscribe({
      next: () => {
        this.isUploading = false;
        this.loadImages();
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.error = 'Failed to upload image';
        this.isUploading = false;
      },
    });
  }

  deleteImage(filename: string) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.imageService.deleteImage(filename).subscribe({
        next: () => this.loadImages(),
        error: (error) => console.error('Error deleting image:', error),
      });
    }
  }

  copyImageUrl(url: SafeUrl | undefined) {
    if (!url) return; // Prevent undefined values
    navigator.clipboard.writeText(url as string).then(() => {
      console.log('URL copied to clipboard');
    });
  }

  onImageSelect(url: SafeUrl | undefined) {
    if (!url) return; // Prevent undefined values
    this.selectImage.emit(url as string);
    this.close.emit();
  }
}
