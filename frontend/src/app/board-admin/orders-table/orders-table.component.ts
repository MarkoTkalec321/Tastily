import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {Order} from "../../model/Order";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderService} from "../../_services/order.service";
import {OrderStatus} from "../../model/OrderStatus";
import {forkJoin, map, Observable} from "rxjs";

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css']
})
export class OrdersTableComponent implements OnInit {

  dataSource: any[] = [];
  displayedColumns: string[] = ['orderId', 'userId', 'username', 'email', 'deliveryStatus', 'update'];
  currentlyEditing: number | null = null;
  editedOrder: Partial<Order> = {};
  orderStatuses: OrderStatus[] = [];
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    public dialogRef: MatDialogRef<OrdersTableComponent>,
    private ordersService: OrderService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    forkJoin({
      statuses: this.loadOrderStatuses(),
      orders: this.loadOrders()
    }).subscribe(result => {
      this.orderStatuses = result.statuses;
      this.dataSource = result.orders;
      console.log('Order statuses and orders loaded successfully');
    }, error => {
      console.error('Error fetching data:', error);
    });
  }

  loadOrderStatuses(): Observable<OrderStatus[]> {
    return this.ordersService.getAllOrderStatuses();
  }

  loadOrders(): Observable<Order[]> {
    return this.ordersService.getAllOrders().pipe(
      map(data => data.map((order: Order) => ({
        id: order.id,
        user_id: order.user_id,
        username: order.username,
        email: order.email,
        status_id: order.status_id,
        status_value: order.status_value
      })))
    );
  }

  updateOrderStatus(id: number) {
    this.currentlyEditing = id;
    const order = this.dataSource.find(ord => ord.id === id);
    this.editedOrder = { ...order };
    this.editedOrder.status = this.orderStatuses.find(status => status.status_value === order.status_value);
    //console.log('updateOrderStatus', this.editedOrder)
  }

  saveChanges(id: number) {
    if (this.editedOrder.status) {
      //console.log("save changes editedOrder.status", this.editedOrder.status);
      this.editedOrder.status_value = this.editedOrder.status.status_value;
      this.editedOrder.status_id = this.editedOrder.status.id;
    }

    this.ordersService.updateOrderWithOrderStatus(this.editedOrder).subscribe(
      response => {
        const updatedOrder = response as Order;
        const index = this.dataSource.findIndex(ord => ord.id === id);
        this.dataSource[index] = updatedOrder;
        this.snackBar.open('Order updated successfully!', 'Close', { duration: 3000 });
        this.currentlyEditing = null;
        this.editedOrder = {};
        this.table.renderRows();
      },
      error => {
        console.error('Error updating the order:', error);
      }
    );
  }

  deleteOrder(id: number) {
    this.ordersService.deleteCategory(id).subscribe(
      response => {

        this.dataSource = this.dataSource.filter(cat => cat.id !== id);
        this.snackBar.open('Order deleted successfully!', 'Close', { duration: 3000 });
        this.table.renderRows();
      },
      error => {
        console.error('Error deleting the order:', error);

        this.snackBar.open('Error deleting the order. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
