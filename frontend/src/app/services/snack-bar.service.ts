import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.show(message, 'success-snackbar');
  }

  showError(message: string): void {
    this.show(message, 'error-snackbar');
  }

  private show(message: string, panelClass: string): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    };
    this.snackBar.open(message, 'Close', config);
  }
}
