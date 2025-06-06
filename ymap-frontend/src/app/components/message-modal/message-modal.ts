import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-message-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './message-modal.html',
    styleUrls: ['./message-modal.scss']
})
export class MessageModalComponent {
    @Input() title = 'Сообщение';
    @Input() message = '';
    @Input() showCancel = false;

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm() {
        this.confirm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }

    onBackdropClick() {
        this.cancel.emit();
    }
}
