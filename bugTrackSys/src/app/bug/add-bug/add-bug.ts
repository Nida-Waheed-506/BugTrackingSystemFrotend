import {ChangeDetectionStrategy, Component , Inject, ViewChild, ElementRef} from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from "ngx-toastr";
import { FormsModule} from "@angular/forms";
import { FormControl } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-bug.html',
  styleUrl: './add-bug.scss',
})
export class AddBug {
  selectedFile: File | "" = "";
  preview = "";
//  for getting developers of the project
  searchName = new FormControl("");
  users: any[] = [];
   selectedUserName = "";
  selectedUserEmail = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, public dialogReg: MatDialogRef<AddBug> , private ToastrService:ToastrService , private Data:Data) {}
  @ViewChild("fileInput") fileInput!: ElementRef;

  // developers get

    // when input is focused show top 5 users
  onFocus() {
    console.log("hello");
    console.log(this.data.projectId);
    if (!this.searchName.value) {
      // this.Data.getTopDevelopers.subscribe({
      //   next: (response: any) => {
      //     console.log(response.data[0]);
      //     this.users = response.data;
      //   },
      // });
    }
  }

    // when select any of the user from the drop down

  onDropdownClick(name: string, email: string) {
    this.selectedUserName = name;
    this.selectedUserEmail = email;
  }




 
  



  // to open image selection dialog

   openImageSelectionDialog(): void {
    
    this.fileInput.nativeElement.click();
  }

 onFileSelected(event: any): void {
    const file: File | null = event.target.files[0];

    if (file) {
      if (file.type !== "image/png" && file.type !== "image/gif") {
        this.ToastrService.error("Only PNG & GIF images are allowed", "Error");
        event.target.value = null;
      } else {
        this.selectedFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
         
          this.preview = e.target.result;
          console.log(this.preview);
          this.ToastrService.success("Image uploaded successfully", "Success");
        };

        reader.readAsDataURL(this.selectedFile); // after read file event call automatically by browser reader.onload
        event.target.value = "";
        
         
      }
    }
  }

  // on Clear the image

   onClearImage() {
    this.selectedFile = "";
    this.preview = "";
    this.ToastrService.success("Image deleted successfully", "Success");
  }


   onSubmit(value: any){
    // console.log(this.selectedFile);
    // console.log(value);
   
    // const formData = new FormData();
    // formData.append('projectName' , value.projectName);
    // formData.append('projectDes' , value.projectDes);
    // formData.append('image' , this.selectedFile);
    // this.Data.addProject(formData);
    // console.log(this.selectedFile);
    console.log(value);
    console.log(this.preview)
  }

  // close the dialog box

  onCloseDialog() {
    this.dialogReg.close('Add bug dialog close');
  }
}
