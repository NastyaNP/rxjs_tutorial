import { Component, inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { routes } from "./app.routes";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public isCollapsed = false;
  public routes = routes.filter((route) => route.path !== "");

  protected readonly activatedRoute = inject(ActivatedRoute);
}
