import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  navItems = signal<MenuItem[]>([]);

  constructor() {
    this.buildMenu(this.router.url);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.buildMenu(e.urlAfterRedirects);
        this.cdr.detectChanges();
      });
  }

  buildMenu(currentUrl: string) {
    const disactive = 'rounded-lg font-bold [&_*]:text-indigo-300! icon-indigo';
    const active = 'bg-amber-400 rounded-lg font-bold [&_*]:text-black-800! icon-dark';
    const menuConfig = [
      { label: 'Resoconto', icon: 'pi pi-chart-pie', route: 'resoconto' },
      { label: 'Spese', icon: 'pi pi-receipt', route: 'spese' },
      { label: 'Rate', icon: 'pi pi-calendar', route: 'rate' },
      { label: 'Salvadanaio', icon: 'pi pi-box', route: 'salvadanaio' },
      { label: 'Risparmi', icon: 'pi pi-arrow-up-right', route: 'risparmio' },
    ];
    this.navItems.set(
      menuConfig.map((item) => ({
        label: item.label,
        icon: item.icon,
        styleClass: currentUrl.includes(item.route) ? active : disactive,
        command: () => this.router.navigateByUrl(item.route),
      })),
    );
  }
}
