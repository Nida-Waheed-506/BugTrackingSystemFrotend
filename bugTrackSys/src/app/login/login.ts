import { Component } from "@angular/core";
import { Img } from "../shared/img/img";
import { RouterLink } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { Service } from "../services/service";
@Component({
  selector: "app-login",
  imports: [Img, RouterLink, FormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login {
  constructor(private Service: Service) {}
  onSubmitSignInForm(val: any) {
    this.Service.getUser(val.email, val.password);
  }
}
