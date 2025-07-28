import { Component } from "@angular/core";
import { Img } from "../shared/img/img";
import { RouterLink } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { Data } from "../services/data";
@Component({
  selector: "app-login",
  imports: [Img, RouterLink, FormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login {
  constructor(private Data: Data) {}
  onSubmitSignInForm(val: any) {
    this.Data.getUser(val.email, val.password);
  }
}
