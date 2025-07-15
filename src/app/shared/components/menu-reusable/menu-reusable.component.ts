import { Component, Input } from '@angular/core';
import { NavRoute } from '../../interfaces/route.interface';

@Component({
  selector: 'app-menu-reusable',
  imports: [],
  templateUrl: './menu-reusable.component.html',
  styleUrl: './menu-reusable.component.scss'
})
export class MenuReusableComponent {
  @Input() items: NavRoute[] = [];
}
