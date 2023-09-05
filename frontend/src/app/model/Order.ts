import {Item} from "./Item";
import {OrderStatus} from "./OrderStatus";

export interface OrderDetails {
  order_id?:number;
  quantity: number;
  item_id: number;
  selected?: boolean;
  item?: Item;
}

export interface Order {
  id: number;
  user_id: number;
  status_id: number;
  cartItems: OrderDetails[];
  totalAmount?: number;
  status_value: string;
  username: string;
  email: string;
  status?: OrderStatus;
}
