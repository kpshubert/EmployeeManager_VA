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
  @Input() minLength: number | null = null;
  @Input() email: boolean = false;

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
    if (this.minLength !== null) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.email) {
      validators.push(Validators.email);
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
    this.errorMessage;
  }

  onTouched(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.control.markAsTouched();
    this.blur.emit(target.value);
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
      } else if (errors?.['min']) {
        returnValue = `Value must be at least ${errors['min'].min}.`;
      } else if (errors?.['max']) {
        returnValue = `Value must be at most ${errors['max'].max}.`;
      } else if (errors?.['maxlength']) {
        returnValue = `Maximum length for this field is ${errors['maxlength'].requiredLength} there are currently ${errors['maxlength'].actualLength} characters`;
      } else if (errors?.['minlength']) {
        returnValue = `Minimum length for this field is ${errors['minlength'].requiredLength} there are currently ${errors['minlength'].actualLength} characters`;
      } else if (errors?.['email']) {
        returnValue = 'Please enter a valid email';
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
