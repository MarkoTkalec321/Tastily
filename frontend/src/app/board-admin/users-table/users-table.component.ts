import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../_services/user.service";
import {UserDetails} from "../../model/User";

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<UsersTableComponent>, private userService: UserService) { }

  dataSource: any[] = [];
  displayedColumns: string[] = ['userId', 'username', 'fullName', 'email', 'address'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.dataSource = data.map((user:UserDetails) => ({
        id: user.id,
        username: user.username,
        fullName: user.fullname,
        email: user.email,
        address: user.addressDto ? user.addressDto.streetName : 'N/A'

      }));
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
