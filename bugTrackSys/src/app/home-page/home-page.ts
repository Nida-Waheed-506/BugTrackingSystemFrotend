import { Component } from '@angular/core';
import { Img } from '../shared/img/img';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  isManagerHovered: boolean = false;
  isDeveloperHovered = false;
  isQAHovered = false;

  // managerHover
  onManagerHover(isManagerHovered: boolean) {
    this.isManagerHovered = isManagerHovered;
  }

  // developer Hover

  onDeveloperHover(isDeveloperHovered: boolean) {
    this.isDeveloperHovered = isDeveloperHovered;
  }

  // QA hover

  onQAHover(isQAHovered: boolean) {
    this.isQAHovered = isQAHovered;
  }
}
