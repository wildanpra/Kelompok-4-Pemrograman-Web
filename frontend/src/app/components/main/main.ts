import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [Header, Footer, Sidebar, RouterOutlet],
  // templateUrl: './main.html',
  styleUrl: './main.css',
  standalone: true,
  template: `
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <!-- Sidebar -->
        <app-sidebar></app-sidebar>

        <!-- Layout page -->
        <div class="layout-page">
          <!-- Header / Navbar -->
          <app-header></app-header>

          <!-- Content wrapper -->
          <div class="content-wrapper">
            <!-- Content -->
            <div class="container-xxl flex-grow-1 container-p-y">
              <router-outlet></router-outlet>
            </div>

            <!-- Footer -->
            <app-footer></app-footer>

            <div class="content-backdrop fade"></div>
          </div>
        </div>
      </div>

      <!-- Overlay -->
      <div class="layout-overlay layout-menu-toggle"></div>
    </div>
  `,
})
export class Main {}
