import { Component } from '@angular/core';
import { Img } from '../shared/img/img';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  Validators,
} from '@angular/forms';
import { Service } from '../services/service';
import { ToastrService } from 'ngx-toastr';
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
  hide: boolean = true;
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
  constructor(private Service: Service, private ToastrService: ToastrService) {}
  onSubmitSignUpForm(val: any) {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    console.log(val);
    // if (val.name.length > 12) {
    //   this.ToastrService.error('Name must be 12 characters or less', 'Error');
    //   return;
    // }

    this.Service.addUser(val.name, val.mobile_number, val.email, val.password);
  }
}
