import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectOptions } from '../../../Models/select-options.data';
import { SelectOptionsService } from '../../../Services/SelectOptions/select-options.service';
import { Subscription } from 'rxjs';
//import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'validated-select-component',
  templateUrl: './validated-select.component.html',
  styleUrl: './validated-select.component.css',
  imports: [
    ReactiveFormsModule //,
//    NgSelectComponent,
//    NgSelectModule
  ]
})
export class ValidatedSelectComponent implements OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() required: boolean = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<any>();

  receivedSelectOptions: SelectOptions[] = [];
  private subscription!: Subscription;
  control: FormControl = new FormControl('', []);

  constructor(private selectOptionsService: SelectOptionsService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.subscription = this.selectOptionsService.currentSelectOptions.subscribe(selectOptionsData => {
      this.receivedSelectOptions = selectOptionsData
    });
    const validators = [];
    if (this.required) {
      validators.push(Validators.required);
    }
    this.control.setValidators(validators);
    this.control.updateValueAndValidity();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public onOptionsChange() {
    this.changeDetectorRef.detectChanges();
  }

  get value(): string {
    return this.control.value;
  }

  set value(val: string) {
    this.control.setValue(val);
    this.valueChange.emit(val);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.control.markAsTouched();
    this.blur.emit(target.value);
    let test:string | null = this.errorMessage;
  }

  onTouched(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.control.markAsTouched();
    this.blur.emit(target.value);
    let test: string | null = this.errorMessage;
  }

  get isInvalid(): boolean {
    return this.control.invalid; // && (this.control.touched || this.control.dirty);
  }

  get errorMessage(): string {
    let returnValue: string = '';
    if (this.isInvalid) {
      const errors = this.control.errors;
      if (errors?.['required']) {
        returnValue = `Please enter a ${this.label.toLowerCase()}.`;
      } else {
        returnValue = 'Invalid input.';
      }
    }
    return returnValue;
  }

  externalValueChange(newValue: any) {
    this.value = newValue;
    this.control.updateValueAndValidity();
  }
}
