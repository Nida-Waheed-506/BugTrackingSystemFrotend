import {Component  } from '@angular/core';
import { Img } from "../shared/img/img";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; 
import { RouterLink} from '@angular/router';

// +++++++++++++++++++++++++ imports end here +++++++++++++++++++++++++++++++++++++


@Component({
  selector: 'app-home-page',
  imports: [Img , MatCardModule, MatButtonModule , MatIconModule ,RouterLink ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage {



}
