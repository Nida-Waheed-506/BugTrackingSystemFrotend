import { Component } from '@angular/core';
import { Img } from '../shared/img/img';
import { MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [Img, MatCardContent, RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  name: string = '';
  mobile_number: string = '';
  email: string = '';
  password: string = '';

  onSubmitSignUpForm(val: NgForm) {
    console.log(val);
    console.log(this.name);
    console.log(this.mobile_number);
    console.log(this.email);
    console.log(this.password);
  }
}
