import {Order} from "./Order";

export interface OrderStatus {
  id?: number;
  status_value: string;
  orderList?: Order[];
}
