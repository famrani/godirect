import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreDbService } from 'godigital-lib';
import { firstValueFrom } from 'rxjs';

@Component({ selector: 'app-my-payments', standalone: false, templateUrl: './my-payments.component.html', styleUrls: ['./my-payments.component.scss'] })
export class MyPaymentsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error = '';
  constructor(private http: HttpClient, private storeDb: StoreDbService) {}
  private async headers(): Promise<HttpHeaders> {
    const auth: any = this.storeDb as any;
    const user = auth.firebaseauth?.currentUser || auth.firebaseAuth?.currentUser || auth.auth?.currentUser;
    if (!user?.getIdToken) throw new Error('Connectez-vous avec Google ou votre email.');
    return new HttpHeaders({ Authorization: `Bearer ${await user.getIdToken()}` });
  }
  async ngOnInit(): Promise<void> { await this.refresh(); }
  async refresh(): Promise<void> {
    this.loading = true; this.error = '';
    try {
      this.bookings = await firstValueFrom(this.http.get<any[]>('/api/me/bookings', { headers: await this.headers() }));
    } catch (error: any) {
      this.bookings = [];
      this.error = error?.error?.message || error?.message || 'Impossible de charger vos paiements.';
    } finally { this.loading = false; }
  }
  amount(value: any): number { const n = Number(value); return Number.isFinite(n) ? n : 0; }
  total(b: any): number { return this.amount(b.rentalAmount ?? b.pricing?.rentalAmount ?? b.totalAmount); }
  deposit(b: any): number { return this.amount(b.bookingDeposit ?? b.depositAmount); }
  balance(b: any): number { return this.amount(b.balanceAmount); }
}
