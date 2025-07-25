import { Component } from '@angular/core';
import { Img } from "../shared/img/img";
import { MatCardContent } from "@angular/material/card";
import { RouterLink} from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [Img, MatCardContent, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

}
