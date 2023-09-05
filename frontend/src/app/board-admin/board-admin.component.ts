import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UsersTableComponent} from "./users-table/users-table.component";
import {CategoriesTableComponent} from "./categories-table/categories-table.component";
import {ItemsTableComponent} from "./items-table/items-table.component";
import {OrdersTableComponent} from "./orders-table/orders-table.component";
import {AddCategoryTableComponent} from "./add-category-table/add-category-table.component";
import {AddItemTableComponent} from "./add-item-table/add-item-table.component";

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent {

  constructor(public dialog: MatDialog) { }

  openUsersDialog(): void {
    const dialogRef = this.dialog.open(UsersTableComponent, {
      autoFocus: false,
      width: '80%',
      height: '80%'
    });
  }

  openCategoriesDialog(): void {
    const dialogRef = this.dialog.open(CategoriesTableComponent, {
      autoFocus: false,
      width: '80%',
      height: '80%'
    });
  }

  openItemsDialog(): void {
    const dialogRef = this.dialog.open(ItemsTableComponent, {
      autoFocus: false,
      width: '80%',
      height: '80%'
    });
  }

  openOrdersDialog(): void {
    const dialogRef = this.dialog.open(OrdersTableComponent, {
      autoFocus: false,
      width: '80%',
      height: '80%'
    });
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryTableComponent, {
      autoFocus: false,
      width: '80%',
      height: '80%'
    });
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(AddItemTableComponent, {
      autoFocus: false,
      width: '80%',
      height: '80%'
    });
  }
}

