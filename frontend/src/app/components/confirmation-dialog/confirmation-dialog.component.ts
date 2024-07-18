import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Output() confirmResult = new EventEmitter<boolean>();

  confirm(result: boolean) {
    this.confirmResult.emit(result);
  }
}
