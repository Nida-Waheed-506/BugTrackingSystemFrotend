import { Component } from '@angular/core';
import { Img } from '../shared/img/img';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../services/user/user';

// +++++++++++++++++++++++++ imports end here +++++++++++++++++++++++++++++++++++++

@Component({
  selector: 'app-home-page',
  imports: [
    Img,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  isManagerHovered = false;
  isDeveloperHovered = false;
  isQAHovered = false;

  constructor(private user_service: User) {}

  // managerHover
  onManagerHover(isManagerHovered: boolean) {
    this.isManagerHovered = isManagerHovered;
    this.user_service.user_type = 'manager';
  }

  // developer Hover

  onDeveloperHover(isDeveloperHovered: boolean) {
    this.isDeveloperHovered = isDeveloperHovered;
    this.user_service.user_type = 'developer';
  }

  // QA hover

  onQAHover(isQAHovered: boolean) {
    this.isQAHovered = isQAHovered;
    this.user_service.user_type = 'QA';
  }
}
