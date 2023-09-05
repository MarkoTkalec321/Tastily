import {inject, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes} from "@angular/router";
import {RegisterComponent} from "./register/register.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {BoardAdminComponent} from "./board-admin/board-admin.component";
import {ProfileComponent} from "./profile/profile.component";
import {CartComponent} from "./cart/cart.component";
import {AuthGuard} from "./auth.guard";
import {CheckoutComponent} from "./checkout/checkout.component";
import {CheckoutGuard} from "./checkout.guard";
import {ProfileGuard} from "./profile.guard";
import {AdminGuard} from "./admin.guard";
import {TrackerComponent} from "./tracker/tracker.component";
import {ProfileDataResolver} from "./_services/profile.data.resolver";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login',
    component: LoginComponent,
    canActivate: [(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      inject(AuthGuard).canActivate(next, state)]
  },
  { path: 'register',
    component: RegisterComponent,
    canActivate: [(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      inject(AuthGuard).canActivate(next, state)]
  },
  { path: 'profile', component: ProfileComponent, resolve: { data: ProfileDataResolver }, canActivate:[(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(ProfileGuard).canActivate(next, state)]  },
  { path: 'admin', component: BoardAdminComponent, canActivate:[(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AdminGuard).canActivate(next, state)]   },
  { path: 'cart', component: CartComponent },
  { path: 'checkout/:order_id', component: CheckoutComponent, canActivate:[(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(CheckoutGuard).canActivate(next, state)] },
  { path: 'checkout', redirectTo: 'home', pathMatch: 'full' },
  { path: 'tracker', component: TrackerComponent, resolve: { data: ProfileDataResolver }, canActivate:[(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(ProfileGuard).canActivate(next, state)]   },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
