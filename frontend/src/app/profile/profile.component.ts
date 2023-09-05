import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { StorageService } from "../_services/storage.service";
import { Router } from "@angular/router";
import { OrderService } from "../_services/order.service";
import { Order } from "../model/Order";
import { ItemsService } from "../_services/items.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import {FlatOrder} from "../model/FlatOrder";
import {OrderDetailsService} from "../_services/orderDetails.service";
import {SharedService} from "../_services/shared.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  displayedColumns: string[] = ['orderId', 'image', 'name', 'quantity', 'status'];
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  currentUser: any;
  orders: Order[] = [];
  dataSource = new MatTableDataSource<FlatOrder>();
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(
    private storageService: StorageService,
    private router: Router,
    private orderService: OrderService,
    private itemsService: ItemsService,
    private cdr: ChangeDetectorRef,
    private orderDetailsService: OrderDetailsService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.fetchCurrentUser();
    this.sharedService.fetchDataAndPrepare();
    this.sharedService.dataSource$.subscribe(dataSource => {
      this.dataSource = dataSource;
      this.dataSource.sort = this.sort;
      this.sort.active = 'orderId';
      this.sort.direction = 'desc';
      this.sort.sortChange.emit();
    });
  }

  private fetchCurrentUser(): void {
    this.currentUser = this.storageService.getUser();
  }

}
