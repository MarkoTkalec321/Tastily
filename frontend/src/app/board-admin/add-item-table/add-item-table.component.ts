import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Category} from "../../model/Category";
import {ItemsService} from "../../_services/items.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoriesService} from "../../_services/categories.service";

@Component({
  selector: 'app-add-item-table',
  templateUrl: './add-item-table.component.html',
  styleUrls: ['./add-item-table.component.css']
})
export class AddItemTableComponent implements OnInit {

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(''),
    discount: new FormControl(''),
    category: new FormControl(''),
    image: new FormControl('')
  });
  categories: Category[] = [];

  constructor(public dialogRef: MatDialogRef<AddItemTableComponent>,
              private formBuilder: FormBuilder,
              private itemService: ItemsService, private snackBar: MatSnackBar,
              private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50)
      ], [this.nameExistsValidator.bind(this)]],
      description: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      price: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]],
      discount: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.error('Error fetching categories:', error);
        this.snackBar.open('Error fetching categories. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  nameExistsValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      this.itemService.checkItemName(control.value)
        .subscribe(isExist => {
          if (isExist) {
            resolve({ 'nameExists': true });
          } else {
            resolve(null);
          }
        });
    });
  }

  selectedFile: File | null = null;
  fileName = '';

  onFileChanged(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    const formData: FormData = new FormData();

    // Append all other form data
    formData.append('name', this.form.value.name);
    formData.append('description', this.form.value.description);
    formData.append('price', this.form.value.price.toString()); // if the value is number
    formData.append('discount', this.form.value.discount.toString()); // if the value is number
    formData.append('category', this.form.value.category);

    // Append the file
    const file: File = this.form.get('image')!.value;
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.fileName);
      formData.append('imageMimeType', this.selectedFile.type);
    }

    this.itemService.saveItem(formData).subscribe({
      next: data => {
        console.log(data);
        this.snackBar.open('Item added successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.snackBar.open('Error while adding item. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
