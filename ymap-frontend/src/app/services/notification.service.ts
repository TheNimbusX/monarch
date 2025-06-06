import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

    showError(message: string) {
        this.zone.run(() => {
            this.snackBar.open(message, 'Закрыть', {
                duration: 4000,
                panelClass: ['snackbar-error'],
                verticalPosition: 'top',
            });
        });
    }
}
