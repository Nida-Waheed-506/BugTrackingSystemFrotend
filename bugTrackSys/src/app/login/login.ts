import { Component } from '@angular/core';
import { Img } from "../shared/img/img";
import { RouterLink} from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [Img,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}
