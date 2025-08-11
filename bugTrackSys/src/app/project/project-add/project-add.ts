import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Service} from '../../services/service';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-add',
  imports: [CommonModule, MatIconModule, FormsModule,ReactiveFormsModule],
  templateUrl: './project-add.html',
  styleUrl: './project-add.scss',
})
export class ProjectAdd {
  selectedFile: File | '' = '';
  preview = '';

  projectForm = new FormGroup({
    projectName:  new FormControl('' , [Validators.required ,  Validators.maxLength(20),]),
    projectDes : new FormControl('',[Validators.required,  Validators.minLength(60)]),
   
  })

  constructor(
    private ToastrService: ToastrService,
    private Service: Service,
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
      if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
  
    if(!this.selectedFile){
      this.ToastrService.error("Add image" , "Error");
      return;
    }

    console.log(this.selectedFile);

    const formData = new FormData();
    formData.append('projectName', value.projectName);
    formData.append('projectDes', value.projectDes);
    formData.append('image', this.selectedFile);
    this.Service.addProject(formData).subscribe({
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
