import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-add',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './project-add.html',
  styleUrl: './project-add.scss',
})
export class ProjectAdd {
  selectedFile: File | '' = '';
  preview = '';
  constructor(
    private ToastrService: ToastrService,
    private Data: Data,
    public dialogRef: MatDialogRef<ProjectAdd>
  ) {}
  @ViewChild('fileInput') fileInput!: ElementRef;

  //  for open the  file dialog on input with reference variable :: fileInput
  openImageSelectionDialog(): void {
    this.fileInput.nativeElement.click();
  }

  //  after taking image from the local pc

  onFileSelected(event: any): void {
    const file: File | null = event.target.files[0];

    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/gif') {
        this.ToastrService.error('Only PNG & GIF images are allowed', 'Error');
        event.target.value = null;
      } else {
        this.selectedFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
          this.ToastrService.success('Image uploaded successfully', 'Success');
        };

        reader.readAsDataURL(this.selectedFile); // after read file event call automatically by browser reader.onload
        event.target.value = '';
      }
    }
  }

  onClearImage() {
    this.selectedFile = '';
    this.preview = '';
    this.ToastrService.success('Image deleted successfully', 'Success');
  }

  onSubmit(value: any) {
    if (!value.projectName || !value.projectDes || !this.selectedFile) {
      this.ToastrService.error('Please fill all fields', 'Error');
      return;
    }

    if (value.projectName.length > 20) {
      this.ToastrService.error(
        'Project name must be 20 characters or less',
        'Error'
      );
      return;
    }

    if (value.projectDes.length < 60) {
      this.ToastrService.error(
        'Project description must not be less than 60 characters',
        'Error'
      );
      return;
    }

    const formData = new FormData();
    formData.append('projectName', value.projectName);
    formData.append('projectDes', value.projectDes);
    formData.append('image', this.selectedFile);
    this.Data.addProject(formData).subscribe({
      next: (response: any) => {
        this.ToastrService.success(response.message, 'Success');
        this.dialogRef.close('Add project dialog close');
      },
      error: (err) => {
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
  }

  // on close the dialog
  onCloseDialog() {
    this.dialogRef.close('Add project dialog close');
  }
}
