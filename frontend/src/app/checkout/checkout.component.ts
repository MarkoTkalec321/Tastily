import {Component, OnInit} from '@angular/core';
import {CartService} from "../_services/cart.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CheckoutItem} from "../cart/cart.component";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  displayedColumns: string[] = ['image', 'name', 'price', 'quantity', 'subtotal'];
  checkoutItems: CheckoutItem[] = [];
  order_id: number | null = null;

  constructor(private cartService: CartService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.order_id = +this.route.snapshot.paramMap.get('order_id')!;
    if (history.state.checkoutItems) {
      this.checkoutItems = history.state.checkoutItems;
    }
  }

  getTotal(): number {
    return this.checkoutItems.reduce((acc, checkoutItem) => acc + (checkoutItem.item.price * checkoutItem.details.quantity), 0);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
