import {SiteTextPipe} from './site-text.pipe';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { OutingsComponent } from './outings/outings.component';
import { BoatComponent } from './boat/boat.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactComponent } from './contact/contact.component';
import { CrewComponent } from './crew/crew.component';
import { FullDayComponent } from './tours/full-day/full-day.component';
import { SunsetCruiseComponent } from './tours/sunset-cruise/sunset-cruise.component';
import { EvjfEvgComponent } from './tours/evjf-evg/evjf-evg.component';
import { BusinessOutingComponent } from './tours/business-outing/business-outing.component';
import { TermsComponent } from './terms/terms.component';
import { SafetyInstructionsComponent } from './safety-instructions/safety-instructions.component';
import { DepositComponent } from './deposit/deposit.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyFeedbacksComponent } from './my-feedbacks/my-feedbacks.component';
import { AdminFeedbacksComponent } from './admin-feedbacks/admin-feedbacks.component';
import { AdminOutingsComponent } from './admin-outings/admin-outings.component';
import { AdminOutingDetailComponent } from './admin-outing-detail/admin-outing-detail.component';
import { AdminManageOutingsComponent } from './admin-manage-outings/admin-manage-outings.component';
import { GuestFaqComponent } from './guest-faq/guest-faq.component';
import { GuestJourneyComponent } from './guest-journey/guest-journey.component';
import { BookingsComponent } from './bookings/bookings.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { MyPaymentsComponent } from './my-payments/my-payments.component';
import { MyOffersComponent } from './my-offers/my-offers.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { BookingInvoiceComponent } from './booking-invoice/booking-invoice.component';
import { AdminWarrantyChargeComponent } from './admin-warranty-charge/admin-warranty-charge.component';
import { AdminOffersComponent } from './admin-offers/admin-offers.component';
import { OfferConfirmationComponent } from './offer-confirmation/offer-confirmation.component';
import { AdminExternalBookingsComponent } from './admin-external-bookings/admin-external-bookings.component';
import { BookingProcessComponent } from './booking-process/booking-process.component';
import { OnlineBookingComponent } from './online-booking/online-booking.component';
import { AdminPricingModelComponent } from './admin-pricing-model/admin-pricing-model.component';
import { AdminFleetComponent } from './admin-fleet/admin-fleet.component';
import { SeaToysComponent } from './sea-toys/sea-toys.component';
import { AdminSiteContentComponent } from './admin-site-content/admin-site-content.component';
import { AdminBoatCalendarComponent } from './admin-boat-calendar/admin-boat-calendar.component';
import { ResourceHomeComponent } from './resource-home/resource-home.component';
import { ResourceBookingComponent } from './resource-booking/resource-booking.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ResourceHomeComponent },
  { path: 'sorties', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sorties/journee-en-mer', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sorties/coucher-de-soleil', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sorties/party', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sorties/anniversaire', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sorties/sortie-entreprise', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sorties/:slug', redirectTo: 'home', pathMatch: 'full' },
  { path: 'bateau', redirectTo: 'home', pathMatch: 'full' },
  { path: 'bateau/jouets-nautiques', redirectTo: 'home', pathMatch: 'full' },
  { path: 'galerie', redirectTo: 'home', pathMatch: 'full' },
  { path: 'reserver', component: ResourceBookingComponent },
  { path: 'book-online', component: ResourceBookingComponent },
  { path: 'book-online-legacy', redirectTo: 'reserver', pathMatch: 'full' },
  { path: 'contact', redirectTo: 'home', pathMatch: 'full' },
  { path: 'crew', redirectTo: 'home', pathMatch: 'full' },
  { path: 'terms', component: TermsComponent },
  { path: 'safety', component: SafetyInstructionsComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'booking-process', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sea-toys', redirectTo: 'home', pathMatch: 'full' },
  { path: 'faq', component: GuestFaqComponent },
  { path: 'how-it-works', redirectTo: 'home', pathMatch: 'full' },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'calendar', component: AdminBoatCalendarComponent, data: { calendarMode: 'customer' } },
  { path: 'my-offers', redirectTo: 'my-bookings', pathMatch: 'full' },
  { path: 'my-proposals', redirectTo: 'my-bookings', pathMatch: 'full' },
  { path: 'my-payments', component: MyPaymentsComponent },
  { path: 'bookings/:bookingId/invoice', component: BookingInvoiceComponent },
  { path: 'bookings/:bookingId', component: BookingDetailComponent },
  { path: 'payment/:bookingId', component: DepositComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'my-feedbacks', component: MyFeedbacksComponent },
  { path: 'leave-feedback', redirectTo: 'my-feedbacks', pathMatch: 'full' },
  { path: 'admin/feedbacks', component: AdminFeedbacksComponent },
  { path: 'admin/reservations', component: BookingsComponent, data: { adminMode: true } },
  { path: 'admin/reservations/:bookingId/invoice', component: BookingInvoiceComponent },
  { path: 'admin/reservations/:bookingId', component: BookingDetailComponent },
  { path: 'admin/bookings', redirectTo: 'admin/reservations', pathMatch: 'full' },
  { path: 'admin/bookings/:bookingId/invoice', redirectTo: 'admin/reservations/:bookingId/invoice', pathMatch: 'full' },
  { path: 'admin/bookings/:bookingId', redirectTo: 'admin/reservations/:bookingId', pathMatch: 'full' },
  { path: 'admin/booking-detail-v2/:bookingId', component: BookingDetailComponent },
  { path: 'admin/payments', component: AccountSummaryComponent, data: { section: 'payments', admin: true } },
  { path: 'admin/outings', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin/calendar', component: AdminBoatCalendarComponent, data: { calendarMode: 'admin' } },
  { path: 'admin/outings/:outingId', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin/manage-outings', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin/offers', redirectTo: 'admin/reservations', pathMatch: 'full' },
  { path: 'admin/proposals', redirectTo: 'admin/reservations', pathMatch: 'full' },
  { path: 'offer/:offerId', component: OfferConfirmationComponent },
  { path: 'proposal/:proposalId', redirectTo: 'offer/:proposalId' },
  { path: 'admin/site-content', component: AdminSiteContentComponent },
  { path: 'admin/content', component: AdminSiteContentComponent },
  { path: 'admin/pricing-model', component: AdminPricingModelComponent },
  { path: 'admin/fleet', component: AdminFleetComponent },
  { path: 'admin/external-bookings', component: BookingsComponent },
  { path: 'admin/new-reservation', component: BookingsComponent },
  { path: 'my-external-bookings', component: AdminExternalBookingsComponent },
  { path: 'admin/warranty-charge', component: AdminWarrantyChargeComponent },
];

@NgModule({
  imports: [SiteTextPipe,RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
