import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Item} from "../../model/Item";
import {MatTable} from "@angular/material/table";
import {ItemsService} from "../../_services/items.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoriesService} from "../../_services/categories.service";
import {Category} from "../../model/Category";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.css']
})
export class ItemsTableComponent implements OnInit{

  dataSource: any[] = [];
  displayedColumns: string[] = ['categoryId', 'name', 'image', 'description', 'category', 'price', 'discount', 'update', 'delete'];
  currentlyEditing: number | null = null;
  editedItem: Partial<Item> = {};
  fileName: string = '';
  categories: Category[] = [];

  form: FormGroup = new FormGroup({
    editedItemPriceControl: new FormControl(''),
    editedItemDiscountControl: new FormControl('')
  });


  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(public dialogRef: MatDialogRef<ItemsTableComponent>,
              private itemsService: ItemsService,
              private categoriesService: CategoriesService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar
              ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      price: ['', [
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]],
      discount: ['', [
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]]
    });
    this.loadItems();
    this.loadCategories();
  }

  loadItems(): void {
    this.itemsService.getAllItems().subscribe(data => {
      this.dataSource = data.map((item: Item) => ({
        ...item
      }));
    }, error => {
      console.error('Error fetching items:', error);
    });
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe(data => {
      this.categories = data;
    }, error => {
      console.error('Error fetching categories:', error);
    });
  }

  getCategoryNameById(id: number | undefined): string {
    const category = this.categories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown';
  }

  onFileChange(event: any, item: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {

        this.editedItem.image = e.target.result.split(',')[1];
        this.editedItem.imageMimeType = file.type;
      };
      reader.readAsDataURL(file);
    }
  }

  getPriceControl(): FormControl {
    return this.form.get('price') as FormControl;
  }

  getDiscountControl(): FormControl {
    return this.form.get('discount') as FormControl;
  }

  updateItem(id: number) {
    this.currentlyEditing = id;
    const item = this.dataSource.find(it => it.id === id);
    if(item) {
      this.editedItem = { ...item };

      // Set the values to the form controls
      this.form.setValue({
        price: this.editedItem.price ? this.editedItem.price.toString() : '',
        discount: this.editedItem.discount ? this.editedItem.discount.toString() : ''
      });
    }
  }


  saveChanges(id: number) {
    if (this.form.valid) {
      this.editedItem.price = parseFloat(this.form.get('price')!.value);
      this.editedItem.discount = parseInt(this.form.get('discount')!.value, 10);

      this.itemsService.updateItem(this.editedItem).subscribe(
        response => {
          const updatedItem = response as Item;
          const index = this.dataSource.findIndex(it => it.id === id);
          this.dataSource[index] = updatedItem;

          this.snackBar.open('Item updated successfully!', 'Close', { duration: 3000 });

          this.currentlyEditing = null;
          this.editedItem = {};

          this.table.renderRows();
        },
        error => {
          console.error('Error updating the item:', error);
        }
      );
    } else {
      this.snackBar.open('Please enter valid values for price and discount!', 'Close', { duration: 3000 });
    }
  }

  deleteItem(id: number) {
    this.itemsService.deleteItem(id).subscribe(
      response => {
        this.dataSource = this.dataSource.filter(it => it.id !== id);

        this.snackBar.open('Item deleted successfully!', 'Close', { duration: 3000 });

        this.table.renderRows();
      },
      error => {
        console.error('Error deleting the item:', error);
        this.snackBar.open('Error deleting the item. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }

}
