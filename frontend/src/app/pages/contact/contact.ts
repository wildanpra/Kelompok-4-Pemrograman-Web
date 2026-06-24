import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactService } from '../../service/contact_services';
import { Contact } from '../../models/Contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
})
export class ContactComponent implements OnInit {
  contacts: Contact[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadContacts();
    }
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactService.getAll().subscribe({
      next: (res) => {
        this.contacts = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'gagal memuat data';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
}
