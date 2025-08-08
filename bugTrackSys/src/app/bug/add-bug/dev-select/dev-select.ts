import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
  @Input() toppingsData : []= [];

  toppings = new FormControl<{ id: number; name: string }[]>([]);
  @Output() selectedIds = new EventEmitter<any | number[]>();

  constructor(private Service: Service, private ToastrService: ToastrService) {
   
  }
  @ViewChild(MatSelect) matSelect!: MatSelect;

  ngOnInit() {
 
    
    this.devs = this.toppingsData;

     if (this.toppingsData && this.toppingsData.length > 0) {
      this.toppings.setValue(this.toppingsData);
    }
    
    if(this.toppingsData.length === 0){
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


    this.searchName.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        console.log('nida');
        if (value?.trim() === '') {
          this.Service.getTopDevelopers(this.projectId).subscribe({
            next: (response: any) => {
              const res = response.data.map((user: any) => ({
                id: user.id,
                name: user.name,
              }));

              const merg = res.concat(this.toppings.value || []);

              const uniqueMap2 = new Map();
              merg.forEach((user: any) => {
                uniqueMap2.set(user.id, user); //key , value
              });

              this.devs = Array.from(uniqueMap2.values());
            },
          });
        } else {
          // when input is enterd in search developer field
          this.Service.getDevByName(value, this.projectId).subscribe({
            next: (response: any) => {
              const res = response.data.map((user: any) => ({
                id: user.id,
                name: user.name,
              }));

              const mer = this.devs.concat(res);

              const uniqueMap1 = new Map();
              mer.forEach((user) => {
                uniqueMap1.set(user.id, user); //key , value store Map
              });

              const merg = Array.from(uniqueMap1.values()).concat(
                this.toppings.value || []
              );

              const uniqueMap2 = new Map();
              merg.forEach((user) => {
                uniqueMap2.set(user.id, user); //key , value
              });

              this.devs = Array.from(uniqueMap2.values());
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
          const res = response.data.map((user: any) => ({
            id: user.id,
            name: user.name,
          }));

          const merg = res.concat(this.toppings.value);

          const uniqueMap2 = new Map();
          merg.forEach((user: any) => {
            uniqueMap2.set(user.id, user); //key , value
          });

          this.devs = Array.from(uniqueMap2.values());
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });
    }
  }
}
