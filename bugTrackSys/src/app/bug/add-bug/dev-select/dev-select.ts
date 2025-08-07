import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Service } from '../../../services/service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-dev-select',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dev-select.html',
  styleUrl: './dev-select.scss',
})
export class DevSelect {
  searchName = new FormControl('');
  devs: any[] = [];
  @Input() projectId: any = '';

  toppings = new FormControl([{
    id : null,
    name: '',
  }]);
  @Output() selectedIds = new EventEmitter< any|number[]>();

  names: any[] = ['hello', 'hy'];
  constructor(private Service: Service, private ToastrService: ToastrService) {}

  ngOnInit() {
    this.Service.getTopDevelopers(this.projectId).subscribe({
      next: (response: any) => {
        this.devs = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
        }));
      },
      error: (err) => {
        this.ToastrService.error(err.error.error, 'Error');
      },
    });

    this.searchName.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        console.log('nida');
        if (value?.trim() === '') {
          this.Service.getTopDevelopers(this.projectId).subscribe({
            next: (response: any) => {
              this.devs = response.data.map((user: any) => ({
                id: user.id,
                name: user.name,
              }));
            },
          });
        } else {
          // when input is enterd in search developer field
          this.Service.getDevByName(value, this.projectId).subscribe({
            next: (response: any) => {
              const allDevs = response.data.map((user: any) => ({
                id: user.id,
                name: user.name,
              }));

              const arr = this.devs.concat(allDevs);

              const uniqueMap = new Map();
              arr.forEach((user) => {
                uniqueMap.set(user.id, user); //key , value store Map
              });

              this.devs = Array.from(uniqueMap.values());
              console.log(this.devs);
            },
          });
        }
      },
    });

    this.toppings.valueChanges.subscribe((selected) => {
      console.log(selected);
      const ids = selected?.map((dev) => dev.id);
     
      this.selectedIds.emit(ids);

      // console.log('hee', this.selectedIds);
      
    });

  
  }

  // when focus the input this execute to search the top developers
  onFocus() {
    if (!this.searchName.value) {
      this.Service.getTopDevelopers(this.projectId).subscribe({
        next: (response: any) => {
          this.devs = response.data.map((user: any) => ({
            id: user.id,
            name: user.name,
          }));
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });
    }
  }
}
