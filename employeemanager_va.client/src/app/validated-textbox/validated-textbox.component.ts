import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, MaxLengthValidator } from '@angular/forms';

@Component({
  selector: 'validated-textbox-component',
  templateUrl: './validated-textbox.component.html',
  styleUrls: ['./validated-textbox.component.css'],
  imports: [ReactiveFormsModule]
})
export class ValidatedTextboxComponent implements OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() maxLength: number | null = null; 

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<any>();

  control: FormControl = new FormControl('', []);

  ngOnInit() {
    const validators = [];
    if (this.required) {
      validators.push(Validators.required);
    }
    if (this.min !== null) {
      validators.push(Validators.min(this.min));
    }
    if (this.max !== null) {
      validators.push(Validators.max(this.max));
    }
    if (this.maxLength !== null) {
      validators.push(Validators.maxLength(this.maxLength));
    }
    this.control.setValidators(validators);
    this.control.updateValueAndValidity();
  }

  get value(): string {
    return this.control.value;
  }

  set value(val: string) {
    this.control.setValue(val);
    this.valueChange.emit(val);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  onTouched(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.control.markAsTouched();
    this.blur.emit(target.value);
  }

  get isInvalid(): boolean {
    return this.control.invalid && (this.control.touched || this.control.dirty);
  }

  get errorMessage(): string | null {
    if (!this.isInvalid) return null;
    const errors = this.control.errors;
    if (errors?.['required']) return 'This field is required.';
    if (errors?.['min']) return `Value must be at least ${errors['min'].min}.`;
    if (errors?.['max']) return `Value must be at most ${errors['max'].max}.`;
    if (errors?.['maxLength']) return `Value max length is ${errors['maxLength'].maxAllowed} currently ${errors['maxLength'].numberEntered}`;
    return 'Invalid input.';
  }

  externalValueChange(newValue: any) {
    this.value = newValue;
    this.control.updateValueAndValidity();
  }
}
