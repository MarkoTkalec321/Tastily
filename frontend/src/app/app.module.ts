import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import {HttpClientModule} from "@angular/common/http";
import {httpInterceptorProviders} from "./_helpers/http.interceptor";
import { AppRoutingModule } from './app-routing.module';
import {TruncatePipe} from "./utils/truncate.pipe";
import {DiscountedPricePipe} from "./utils/discount.pipe";
import { CartComponent } from './cart/cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import { CheckoutComponent } from './checkout/checkout.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import { UsersTableComponent } from './board-admin/users-table/users-table.component';
import { CategoriesTableComponent } from './board-admin/categories-table/categories-table.component';
import { ItemsTableComponent } from './board-admin/items-table/items-table.component';
import { OrdersTableComponent } from './board-admin/orders-table/orders-table.component';
import {MatIconModule} from "@angular/material/icon";
import { AddCategoryTableComponent } from './board-admin/add-category-table/add-category-table.component';
import { AddItemTableComponent } from './board-admin/add-item-table/add-item-table.component';
import {MatSelectModule} from "@angular/material/select";
import { TrackerComponent } from './tracker/tracker.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSidenavModule} from "@angular/material/sidenav";
import { ItemModalComponent } from './home/item-modal/item-modal.component';
import {ModalService} from "./_services/modal.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    TruncatePipe,
    DiscountedPricePipe,
    CartComponent,
    CheckoutComponent,
    UsersTableComponent,
    CategoriesTableComponent,
    ItemsTableComponent,
    OrdersTableComponent,
    AddCategoryTableComponent,
    AddItemTableComponent,
    TrackerComponent,
    ItemModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    SlickCarouselModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatSidenavModule
  ],
  providers: [httpInterceptorProviders, ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
