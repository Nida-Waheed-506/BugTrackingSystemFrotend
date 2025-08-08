import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from '../../services/service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevSelect } from './dev-select/dev-select';

@Component({
  selector: 'app-add-bug',
  imports: [
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
    DevSelect,
  ],
  providers: [provideNativeDateAdapter()],

  templateUrl: './add-bug.html',
  styleUrl: './add-bug.scss',
})
export class AddBug {
  selectedFile: File | '' = '';
  preview = '';
  developerAddedToBug: any[] = [];

  searchName = new FormControl('');
  users: any[] = [];
  selectedUserName = '';
  selectedUserId = '';
  dialogTitle: String = '';
  dialogBtn: String = '';

  bugForm: FormGroup;
  developers: [] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddBug>,
    private ToastrService: ToastrService,
    private Service: Service
  ) {
    this.dialogTitle = this.data.dialogTitle;
    this.dialogBtn = this.data.btnName;
    console.log(this.data);
    if (this.data.bugDetail) {
      this.bugForm = new FormGroup({
        deadline: new FormControl(this.data.bugDetail.deadline),
        title: new FormControl(this.data.bugDetail.title),
        description: new FormControl(this.data.bugDetail.description),
        type: new FormControl(this.data.bugDetail.type),
      });
      this.developers = this.data.bugDetail.developersDetail;
     

      // for image
      if (this.data.bugDetail.screenshot) {
        this.selectedFile = this.data.bugDetail.screenshot;
        const jsonImage = JSON.stringify(this.data.bugDetail.screenshot);
        const base64Image = btoa(jsonImage);
        this.preview = `data:image/png;base64,${base64Image}`;
        console.log(this.preview);
      }



    } else {
      this.bugForm = new FormGroup({
        deadline: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
        type: new FormControl(''),
      });
    }
  }
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit() {}

  getIds(value: any[]) {
    this.developerAddedToBug = value;
    console.log(this.developerAddedToBug);
  }

  openImageSelectionDialog(): void {
    this.fileInput.nativeElement.click();
  }

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
          console.log(this.preview);

          this.ToastrService.success('Image uploaded successfully', 'Success');
        };

        reader.readAsDataURL(this.selectedFile); // after read file event call automatically by browser reader.onload
        event.target.value = '';
      }
    }
  }

  // on Clear the image

  onClearImage() {
    this.selectedFile = '';
    this.preview = '';
    this.ToastrService.success('Image deleted successfully', 'Success');
  }

  onSubmit(value: any) {
    console.log(value);
    if (!value.deadline || !value.description || !value.title || !value.type) {
      this.ToastrService.error('Plz fill all fields', 'Error');
    }

    if (value.title.length > 20) {
      this.ToastrService.error('Title must be 20 characters or less', 'Error');
      return;
    }

    if (value.description.length < 20) {
      this.ToastrService.error(
        'Description must be greater than 20 characters',
        'Error'
      );
      return;
    }

    if (this.developerAddedToBug.length < 1) {
      this.ToastrService.error('Atleast add one developer', 'Error');
      return;
    }

    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('deadline', new Date(value.deadline).toISOString());
    formData.append('type', value.type);
    formData.append('developer_id', JSON.stringify(this.developerAddedToBug));
    formData.append('screenshot', this.selectedFile);
    formData.append('project_id', this.data.projectId);

    if(this.data.bugDetail.btnName === 'Add New Bug'){
        this.Service.createBug(formData).subscribe({
      next: (response: any) => {
        this.ToastrService.success(response.message, 'Success');
        this.dialogRef.close('Add bug dialog close');
      },
      error: (err) => {
        console.log(err);
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
    }else{
      
       this.Service.editBug(formData , this.data.bugDetail.id).subscribe({
      next: (response: any) => {
        this.ToastrService.success(response.message, 'Success');
        this.dialogRef.close('Add bug dialog close');
      },
      error: (err:any) => {
        console.log(err);
        this.ToastrService.error(err.error.error, 'Error');
      },
    });


    }
  }

  // close the dialog box

  onCloseDialog() {
    this.dialogRef.close('bug dialog close');
  }
}
