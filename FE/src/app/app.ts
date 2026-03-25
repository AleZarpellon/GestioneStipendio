import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { HeaderComponent } from './view/header/header.component';
import { RouterOutlet } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './shared/spinner/spinner.service';
import { ToastModule } from 'primeng/toast';
import { ErrorBoundaryComponent } from './shared/error/error-boundary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    ProgressSpinnerModule,
    ToastModule,
    ErrorBoundaryComponent,
  ],
  templateUrl: 'app.html',
})
export class AppComponent {
  spinnerService = inject(SpinnerService);
}
