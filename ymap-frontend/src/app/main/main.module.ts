import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { FormsModule } from '@angular/forms';
import { AuthModalComponent } from '../components/auth-modal/auth-modal';

@NgModule({
    imports: [
        CommonModule,
        MainComponent,
        FormsModule,
        AuthModalComponent,
    ],
})
export class MainModule { }
