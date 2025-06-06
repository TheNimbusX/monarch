import { Injectable, NgZone } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Произошла ошибка. Попробуйте снова.';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Нет соединения с сервером.';
        } else if (error.status === 403) {
          errorMessage = 'Доступ запрещён.';
        } else if (error.status === 404) {
          errorMessage = 'Ресурс не найден.';
        } else if (error.status === 422 && error.error?.errors) {
          const messages = Object.values(error.error.errors)
            .map((arr: any) => arr.join(' '))
            .join(' ');
          errorMessage = messages;
        }

        // Показываем snackbar в NgZone
        this.zone.run(() => {
          console.log('[SNACKBAR] =>', errorMessage);
          this.snackBar.open(errorMessage, 'Закрыть', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        });

        return throwError(() => error);
      })
    );
  }
}
