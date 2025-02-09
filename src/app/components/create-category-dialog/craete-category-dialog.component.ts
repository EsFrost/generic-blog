import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-category-dialog.component.html',
})
export class CreateCategoryDialogComponent {
  @Output() closeDialog = new EventEmitter<boolean>();

  categoryName: string = '';
  error: string = '';
  isSubmitting: boolean = false;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    if (!this.categoryName.trim()) {
      this.error = 'Category name is required';
      return;
    }

    this.isSubmitting = true;
    this.apiService.createCategory({ name: this.categoryName }).subscribe({
      next: () => {
        this.closeDialog.emit(true); // true indicates successful creation
      },
      error: (err) => {
        this.error = err.error.error || 'Failed to create category';
        this.isSubmitting = false;
      },
    });
  }

  close() {
    this.closeDialog.emit(false); // false indicates cancelled
  }
}
