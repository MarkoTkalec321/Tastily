import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountedPrice'
})
export class DiscountedPricePipe implements PipeTransform {
  transform(price: number, discount: number): number {
    return price - (price * discount / 100);
  }
}
