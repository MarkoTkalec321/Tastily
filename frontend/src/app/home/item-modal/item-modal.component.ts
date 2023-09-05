import {Component, Input} from '@angular/core';
import {ModalService} from "../../_services/modal.service";
import {Router} from "@angular/router";
import {OrderDetails} from "../../model/Order";
import {CartService} from "../../_services/cart.service";

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent {
  @Input() item: any;
  isVisible = false;

  constructor(private modalService: ModalService,
              private router: Router, private cartService: CartService) {}

  ngOnInit() {
    this.modalService.isVisible$.subscribe(visible => {
      this.isVisible = visible;
    });
  }

  hideModal(event: Event) {
    event.stopPropagation();
    this.modalService.hide();
  }

  addToCartFromModal(item: any) {

    const orderDetails: OrderDetails = {
      quantity: 1,
      item_id: item.id
    };

    this.cartService.addToCart(item, orderDetails);
  }
}
