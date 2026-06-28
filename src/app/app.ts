import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNav } from "./partials/main-nav/main-nav";
import { MainFooter } from "./partials/main-footer/main-footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainNav, MainFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Project-Unit');
}
