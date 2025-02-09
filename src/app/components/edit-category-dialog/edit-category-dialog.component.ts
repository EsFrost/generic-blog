import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-category-dialog.component.html',
})
export class EditCategoryDialogComponent {
  @Input() category: { id: string; name: string } | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  categoryName: string = '';
  error: string = '';
  isSubmitting: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if (this.category) {
      this.categoryName = this.category.name;
    }
  }

  onSubmit() {
    if (!this.categoryName.trim()) {
      this.error = 'Category name is required';
      return;
    }

    if (!this.category) {
      this.error = 'Category not found';
      return;
    }

    this.isSubmitting = true;
    this.apiService
      .updateCategory(this.category.id, { name: this.categoryName })
      .subscribe({
        next: () => {
          this.closeDialog.emit(true);
        },
        error: (err) => {
          this.error = err.error.error || 'Failed to update category';
          this.isSubmitting = false;
        },
      });
  }

  close() {
    this.closeDialog.emit(false);
  }
}
