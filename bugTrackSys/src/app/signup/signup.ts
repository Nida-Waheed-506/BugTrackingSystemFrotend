import { Component } from '@angular/core';
import { Img } from '../shared/img/img';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../services/user/user';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-signup',
  imports: [
    Img,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  hide = true;
  signUpForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(12)]),
    mobile_number: new FormControl('', [
      Validators.required,
      Validators.pattern('^(((\\+92)?)(0)?)(3)([0-9]{9})$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$'
      ),
    ]),
  });
  constructor(private user_service: User) {}
  onSubmitSignUpForm(val: any) {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.user_service.addUser(
      val.name,
      val.mobile_number,
      val.email,
      val.password
    );
  }
}
