import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

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
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-bug.html',
  styleUrl: './add-bug.scss',
})
export class AddBug {
  selectedFile: File | '' = '';
  preview = '';
  developerAddedToBug: any[] = [];

  //  for getting developers of the project
  searchName = new FormControl('');
  users: any[] = [];
  selectedUserName = '';
  selectedUserId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddBug>,
    private ToastrService: ToastrService,
    private Data: Data
  ) {}
  @ViewChild('fileInput') fileInput!: ElementRef;

  // developers get

  ngOnInit() {
    this.searchName.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        if (value?.trim() === '')
          this.Data.getTopDevelopers(this.data.projectId).subscribe({
            next: (response: any) => {
              this.users = response.data;
            },
          });
        else {
          this.Data.getDevByName(value, this.data.projectId).subscribe({
            next: (response: any) => {
              this.users = response.data;
            },
          });
        }
      },
    });
  }
  // when input is focused show top 2 developers
  onFocus() {
    console.log('hello focus');
    if (!this.searchName.value) {
      this.Data.getTopDevelopers(this.data.projectId).subscribe({
        next: (response: any) => {
          this.users = response.data;
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });
    }
  }

  onBlur() {
    console.log('hello blur');
    this.users = [];
    this.searchName.setValue('');
  }
  // when select any of the user from the drop down

  onDropdownClick(name: string, id: string) {
    this.selectedUserName = name;
    this.selectedUserId = id;

    if (this.developerAddedToBug.includes(id)) {
      this.ToastrService.error('This user is already added in list', 'Error');
    } else {
      this.developerAddedToBug.push(id);
      this.ToastrService.success('User added in list successfully', 'Success');
    }

    this.users = [];
  }

  // to open image selection dialog

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

    console.log(this.selectedFile, typeof this.developerAddedToBug[0]);

    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('deadline', new Date(value.deadline).toISOString());
    formData.append('type', value.type);
    formData.append('developer_id', JSON.stringify(this.developerAddedToBug));
    formData.append('screenshot', this.selectedFile);
    formData.append('project_id', this.data.projectId);

    this.Data.createBug(formData).subscribe({
      next: (response: any) => {
        this.ToastrService.success(response.message, 'Success');
        this.dialogRef.close('Add bug dialog close');
      },
      error: (err) => {
        console.log(err);
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
  }

  // close the dialog box

  onCloseDialog() {
    this.dialogRef.close('Add bug dialog close');
  }
}
