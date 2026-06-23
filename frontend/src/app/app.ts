import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { Footer } from './components/footer/footer';
import { CustomerComponent } from './pages/customer/customer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer, CustomerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}
