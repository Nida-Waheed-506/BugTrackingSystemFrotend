import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  OnInit,
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
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BugService } from '../../services/bug/bug';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevSelect } from './dev-select/dev-select';

// .................................imports end here .............................
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
export class AddBug implements OnInit {
  // Component variable

  selectedFile: File | '' = '';
  preview = '';
  developerAddedToBug: any[] = [];

  searchName = new FormControl('');
  users: any[] = [];
  selectedUserName = '';
  selectedUserId = '';
  dialogTitle = '';
  dialogBtn = '';

  bugForm: FormGroup;
  developers: [] = [];

  // constructore

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddBug>,
    private ToastrService: ToastrService,
    private bug_service: BugService
  ) {
    //  initialize component variable with task value if edit form

    this.dialogTitle = this.data.dialogTitle;
    this.dialogBtn = this.data.btnName;

    if (this.data.bugDetail) {
      this.bugForm = new FormGroup({
        deadline: new FormControl(
          this.data.bugDetail.deadline,
          Validators.required
        ),
        title: new FormControl(this.data.bugDetail.title, [
          Validators.required,
          Validators.maxLength(15),
        ]),
        description: new FormControl(this.data.bugDetail.description, [
          Validators.required,
          Validators.minLength(20),
        ]),
        type: new FormControl(this.data.bugDetail.type, Validators.required),
      });
      this.developers = this.data.bugDetail.developersDetail;

      this.developerAddedToBug = this.data.bugDetail.developer_id;
      // for image
      if (this.data.bugDetail.screenshot) {
        this.selectedFile = this.data.bugDetail.screenshot;
        const uint8Array = new Uint8Array(this.data.bugDetail.screenshot.data);
        let binary = '';
        uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
        const base64Image = btoa(binary);
        this.preview = `data:image/png;base64,${base64Image}`;
      }
    } else {
      // if add form

      this.bugForm = new FormGroup({
        deadline: new FormControl('', Validators.required),
        title: new FormControl('', [
          Validators.required,
          Validators.maxLength(15),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(20),
        ]),
        type: new FormControl('', Validators.required),
      });
    }
  }
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit() {}

  getIds(value: any[]) {
    this.developerAddedToBug = value;
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
    if (this.bugForm.invalid) {
      this.bugForm.markAllAsTouched();
      return;
    }

    if (this.developerAddedToBug.length < 1) {
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

    if (this.dialogBtn === 'Add') {
      this.bug_service.createBug(formData).subscribe({
        next: (response: any) => {
          this.ToastrService.success(response.message, 'Success');
          this.dialogRef.close('Add bug dialog close');
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });
    } else {
      this.bug_service.editBug(formData, this.data.bugDetail.id).subscribe({
        next: (response: any) => {
          this.ToastrService.success(response.message, 'Success');
          this.dialogRef.close('Add bug dialog close');
        },
        error: (err: any) => {
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
