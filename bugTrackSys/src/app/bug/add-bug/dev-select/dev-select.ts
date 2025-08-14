import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BugService } from '../../../services/bug/bug';
import { ProjectService } from '../../../services/project/project';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';

// .................................... imports ends ............................

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
export class DevSelect implements OnInit {
  // component variable

  searchName = new FormControl('');
  devs: any[] = [];
  @Input() projectId: any = '';
  @Input() toppingsData: [] = [];

  toppings = new FormControl<{ id: number; name: string }[]>(
    [],
    Validators.required
  );
  @Output() selectedIds = new EventEmitter<any | number[]>();

  // constructor

  constructor(
    private bug_service: BugService,
    private project_service: ProjectService,
    private ToastrService: ToastrService
  ) {}
  @ViewChild(MatSelect) matSelect!: MatSelect;

  ngOnInit() {
    this.devs = this.toppingsData;

    if (this.toppingsData && this.toppingsData.length > 0) {
      this.toppings.setValue(this.toppingsData);
    }

    // when no focus no search developer

    if (this.toppingsData.length === 0) {
      this.project_service.getTopDevelopers(this.projectId).subscribe({
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

    // when search the name of the developer and after search remove

    this.searchName.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        if (value?.trim() === '') {
          this.project_service.getTopDevelopers(this.projectId).subscribe({
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
          this.project_service.getDevByName(value, this.projectId).subscribe({
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

    // send developes back to add bug component

    this.toppings.valueChanges.subscribe((selected) => {
      const ids = selected?.map((dev) => dev.id);

      this.selectedIds.emit(ids);
    });
  }

  // when focus the input this execute to search the top developers
  onFocus() {
    if (!this.searchName.value) {
      this.project_service.getTopDevelopers(this.projectId).subscribe({
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
