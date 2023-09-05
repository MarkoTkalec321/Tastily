import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CategoriesService} from "../../_services/categories.service";
import {Category} from "../../model/Category";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.css']
})
export class CategoriesTableComponent implements OnInit{

  dataSource: any[] = [];
  displayedColumns: string[] = ['categoryId', 'name', 'description', 'update', 'delete'];
  currentlyEditing: number | null = null;
  editedCategory: Partial<Category> = {};
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(public dialogRef: MatDialogRef<CategoriesTableComponent>,
              private categoriesService: CategoriesService,
              private snackBar:MatSnackBar) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe(data => {
      this.dataSource = data.map((category:Category) => ({
        id: category.id,
        name: category.name,
        description: category.description
      }));
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  updateCategory(id: number) {
    this.currentlyEditing = id;
    const category = this.dataSource.find(cat => cat.id === id);
    this.editedCategory = { ...category };
  }

  saveChanges(id: number) {
    this.categoriesService.updateCategory(this.editedCategory).subscribe(
      response => {

        const updatedCategory = response as Category;

        const index = this.dataSource.findIndex(cat => cat.id === id);
        this.dataSource[index] = updatedCategory;

        this.snackBar.open('Category updated successfully!', 'Close', { duration: 3000 });

        this.currentlyEditing = null;
        this.editedCategory = {};

        this.table.renderRows();
      },
      error => {
        console.error('Error updating the category:', error);
      }
    );
  }

  deleteCategory(id: number) {
    this.categoriesService.deleteCategory(id).subscribe(
      response => {

        this.dataSource = this.dataSource.filter(cat => cat.id !== id);

        this.snackBar.open('Category deleted successfully!', 'Close', { duration: 3000 });

        this.table.renderRows();
      },
      error => {
        console.error('Error deleting the category:', error);

        this.snackBar.open('Error deleting the category. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }


  close(): void {
    this.dialogRef.close();
  }

}
