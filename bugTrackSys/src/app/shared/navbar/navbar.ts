import { Component } from '@angular/core';
import { Service } from '../../services/service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  loggedInUser: any | null = null;
  constructor(private Service: Service) {}
  ngOnInit() {
    this.loggedInUser = this.Service.loggedInUserInfo$.pipe((user) => {
      console.log(user);
      return user;
    });
  }
  onLogout() {
    this.Service.userLogout();
  }
}
