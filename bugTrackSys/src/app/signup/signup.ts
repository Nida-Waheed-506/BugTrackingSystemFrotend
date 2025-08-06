import { Component } from '@angular/core';
import { Img } from '../shared/img/img';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Service} from '../services/service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  imports: [Img, RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  constructor(private Service: Service, private ToastrService: ToastrService) {}
  onSubmitSignUpForm(val: any) {
    if (val.name.length > 12) {
      this.ToastrService.error('Name must be 12 characters or less', 'Error');
      return;
    }

    if (val.mobile_number.length > 13) {
      this.ToastrService.error(
        'Mobile number must be 13 characters long with country code',
        'Error'
      );
      return;
    }

    this.Service.addUser(val.name, val.mobile_number, val.email, val.password);
  }
}
