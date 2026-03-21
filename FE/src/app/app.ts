import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { HeaderComponent } from './view/header/header.component';
import { RouterOutlet } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './shared/spinner/spinner.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, ProgressSpinnerModule, ToastModule],
  templateUrl: 'app.html',
})
export class AppComponent {
  spinnerService = inject(SpinnerService);
}
