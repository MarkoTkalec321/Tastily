import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {CategoriesService} from "../../_services/categories.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-category-table',
  templateUrl: './add-category-table.component.html',
  styleUrls: ['./add-category-table.component.css']
})
export class AddCategoryTableComponent implements OnInit{

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    descriptiob: new FormControl('')
  });
  constructor(public dialogRef: MatDialogRef<AddCategoryTableComponent>,
              private formBuilder: FormBuilder,
              private categoryService: CategoriesService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50),
      ], [this.categoryNameValidator.bind(this)]],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  categoryNameValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      this.categoryService.checkCategoryName(control.value)
        .subscribe(isExist => {
          if (isExist) {
            resolve({ 'nameExists': true });
          } else {
            resolve(null);
          }
        });
    });
  }

  onSubmit(): void {
    const { name, description } = this.form.value;

    this.categoryService.saveCategory(name, description).subscribe({
      next: data => {
        console.log(data);
        this.snackBar.open('Category added successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.snackBar.open('Error while adding category. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
