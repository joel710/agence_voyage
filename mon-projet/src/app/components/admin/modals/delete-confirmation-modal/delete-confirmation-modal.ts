import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirmation-modal.html', // Corrected
  styleUrls: ['./delete-confirmation-modal.css']  // Corrected
})
export class DeleteConfirmationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() itemName: string = 'cet élément'; // Default item name

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();

  constructor() {}

  onConfirmDelete(): void {
    this.confirmDelete.emit();
  }
}
