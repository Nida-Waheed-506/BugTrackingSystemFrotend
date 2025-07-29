import { Component } from "@angular/core";
import { Img } from "../shared/img/img";
import { RouterLink } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { Data } from "../services/data";

@Component({
  selector: "app-signup",
  imports: [Img, RouterLink, FormsModule],
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss",
})
export class Signup {
  constructor(private Data: Data) {}
  onSubmitSignUpForm(val: any) {
    this.Data.addUser(val.name, val.mobile_number, val.email, val.password);
  }
}
