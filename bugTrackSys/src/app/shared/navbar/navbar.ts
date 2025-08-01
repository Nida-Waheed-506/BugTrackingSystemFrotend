import { Component } from '@angular/core';
import { Data } from '../../services/data';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  loggedInUser: any | null = null;
  constructor(private Data: Data) {}
  ngOnInit() {
    this.loggedInUser = this.Data.loggedInUserInfo$.pipe((user) => {
      console.log(user);
      return user;
    });
  }
  onLogout() {
    this.Data.userLogout();
  }
}
