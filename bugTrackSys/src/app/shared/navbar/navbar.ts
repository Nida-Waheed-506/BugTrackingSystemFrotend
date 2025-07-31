import { Component } from '@angular/core';
import {Data} from '../../services/data'
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  constructor(private Data:Data){}
 onLogout(){
 this.Data.userLogout();
 }
}
