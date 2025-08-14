import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { faAsterisk, faCheckCircle, faUser, faWindowClose, faSave, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Employee } from './models/employee';
import { Department } from './models/department';
import { StatusMessageParameters } from './models/StatusMessageParameters';
import { EmployeeService } from './employee.service';
import { EmployeeTable } from './employee-table.component';
import { ValidatedTextboxComponent } from './validated-textbox/validated-textbox.component';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ObjToKeysPipe } from './Pipes/objToKeys';
import { valHooks } from 'jquery';

@Component({
  selector: 'employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  providers: [EmployeeService],
  imports: [EmployeeTable,
    ReactiveFormsModule,
    ValidatedTextboxComponent
  ]
})

export class EmployeeFormComponent implements OnInit, AfterViewInit {
  public employees: Employee[] = [];
  public departments: Department[] = [];

  public employee: Employee = {
    rowNum: 0,
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    departmentId: 0,
    departmentIdString: '',
    departmentName: '',
    formMode: 'add'
  };

  public columnNames = [
    { name: '', value: '', sort: '', filter: '' },
    { name: 'firstName', value: 'First Name', sort: 'firstName', filter: 'firstName' },
    { name: 'lastName', value: 'Last Name', sort: 'lastName', filter: 'lastName' },
    { name: 'email', value: 'Email', sort: 'email', filter: 'email' },
    { name: 'phone', value: 'Phone', sort: 'phone', filter: 'phone' },
    { name: 'departmentName', value: 'Department Name', sort: 'departmentName', filter: 'departmentName' }
  ];

  public department: Department = {
    id: 0,
    idString: '0',
    name: ''
  };

  employeeForm: FormGroup;

  constructor(private http: HttpClient, private employeeService: EmployeeService, private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      departmentIdString: ['', [Validators.required]]
    });
  }

  async reloadAfterClientEditClick(idIn: number) {
    if (idIn !== undefined) {
      const returnValue = await this.employeeService.getEmployee(idIn);
      this.employee = returnValue;
      this.changeFormValues();
      this.saveButtonIcon = faSave;
      this.submitButtonText = 'Update';
    }
  }

  changeFormValues() {
    this.employeeFirstNameControl?.externalValueChange(this.employee.firstName);
    this.employeeForm.get('firstName')?.setValue(this.employee.firstName);
    this.employeeLastNameControl?.externalValueChange(this.employee.lastName);
    this.employeeForm.get('lastName')?.setValue(this.employee.lastName);
    this.employeeEmailControl?.externalValueChange(this.employee.email);
    this.employeeForm.get('email')?.setValue(this.employee.email);
    this.employeePhoneControl?.externalValueChange(this.employee.phone);
    this.employeeForm.get('phone')?.setValue(this.employee.phone);
    this.employeeForm.get('departmentIdString')?.setValue(this.employee.departmentIdString);
    this.employeeForm.get('departmentIdString')?.updateValueAndValidity();
    this.setInvalidMessages();
  }

  async ngOnInit() {
    this.employee = await this.employeeService.getEmployee(0);
    this.getDepartments(0, 'list', '');
    this.setInvalidMessages();
  }

  ngAfterViewInit() {
    this.setUpJqueryTestButton();
  }

  getDepartments(idIn: number, modeIn: string, filterIn: string) {
    const parms = new HttpParams().set('id', idIn).set('mode', modeIn).set('filter', filterIn);

    this.http.get<Department[]>('/department', { params: parms }).subscribe(
      (result) => {
        this.departments = result;
        if (this.departments.length === 1) {
          this.department = this.departments[0];
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  @ViewChild('childEmployeeTable') childEmployeeTable: EmployeeTable | undefined;
  @ViewChild('employeeFirstNameControl') employeeFirstNameControl: ValidatedTextboxComponent | undefined;
  @ViewChild('employeeLastNameControl') employeeLastNameControl: ValidatedTextboxComponent | undefined;
  @ViewChild('employeePhoneControl') employeePhoneControl: ValidatedTextboxComponent | undefined;
  @ViewChild('employeeEmailControl') employeeEmailControl: ValidatedTextboxComponent | undefined;

  title = 'EmployeeManager_VA.client';
  faCheckCircle = faCheckCircle;
  faAsterisk = faAsterisk;
  faUser = faUser;
  faWindowClose = faWindowClose;
  faSave = faSave;
  saveButtonIcon = faPlusCircle;
  submitButtonText = 'Add';
  statusMessage = '';
  processResultMessage = '';
  departmentErrorMessage: string = '';

  async Submit() {
    this.setInvalidMessages();
    if (this.employeeForm.valid && this.customControlsAreValid()) {
      this.lazyLoadEmployeesTable('');
      this.employeeService.employee = this.employee;
      this.processResultMessage = await this.employeeService.postEmployeeData();
      this.showStatusMessage({ MessageText: this.processResultMessage, TimeoutIn: 5 });
      await this.childEmployeeTable?.refreshDataTable();
    } else {
      this.showStatusMessage({ MessageText: 'Form has invalid data.', TimeoutIn: 5 });
    }
  }

  addButtonClick(event: any) {
    this.employeeService.employee = this.employee;
    this.employeeService.addEmployee();
    this.changeFormValues();
  }

  departmentSelectChange(event: Event) {

    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedValueNumber = parseInt(selectedValue);

    this.employee.departmentId = selectedValueNumber;
    this.setInvalidMessages();
  }

  setUpJqueryTestButton() {
    $("#btnJqueryTest").css('color', 'blue');
    $("#btnJqueryTest").on('click', function () {
      alert('Jquery event test!');
    });
  }

  async lazyLoadEmployeesTable(event: any) {
    this.employee = await this.employeeService.getEmployee(0);
  }

  showStatusMessage(statusMessageParameters: StatusMessageParameters) {
    var timeoutInMS: number = 3000;

    if (typeof statusMessageParameters.TimeoutIn === "number") {
      timeoutInMS = statusMessageParameters.TimeoutIn * 1000;
    }
    this.statusMessage = statusMessageParameters.MessageText;
    setTimeout(() => {
      this.statusMessage = '';
    }, timeoutInMS);
  }

  getInvalidMessage(controlName: string, friendlyName: string) {
    let returnValue: string = '';
    let formControl = this.employeeForm.controls[controlName];
    let pipe = new ObjToKeysPipe();

    if (formControl.errors !== null) {
      for (var key of pipe.transform(formControl.errors)) {
        let keyValue = formControl.errors[key];
        if (key === 'required') {
          returnValue = 'Please enter a ' + friendlyName + '.';
        } else if (key === 'maxlength') {
          let maxAllowed = keyValue.requiredLength;
          let numberEntered = keyValue.actualLength;
          returnValue = 'Allowed length for ' + friendlyName + ' is: ' + maxAllowed + " entered: " + numberEntered;
        } else if (key = 'email')
        {
          returnValue = 'Please enter a valid email address';
        }
      }
    } else {
      returnValue = '';
    }

    return returnValue;
  }

  setInvalidMessages() {
    let firstNameErrorMessage = this.employeeFirstNameControl?.errorMessage;
    let lastNameErrorMessage = this.employeeLastNameControl?.errorMessage;
    let emailErrorMessage = this.employeeEmailControl?.errorMessage;
    let phoneErrorMessage = this.employeePhoneControl?.errorMessage;
    this.departmentErrorMessage = this.getInvalidMessage('departmentIdString', 'department');
  }

  getFormControl<FormControl>(formControlName: string) {
    return this.employeeForm.controls[formControlName] as FormControl;
  }

  setEmployeeFieldValue<T>(fieldNameIn: string, fieldValue: string) {
    let fieldName: string = fieldNameIn || '';
    this.employee[fieldName] = fieldValue;
  }

  onSubControlBlur(value: any, updateField: string) {
    this.employee[updateField] = value;
  }

  onSubControlChange(value: any, updateField: string) {
    this.employee[updateField] = value;
  }

  customControlsAreValid() {
    let returnValue: boolean = true;

    let firstNameIsValid = this.employeeFirstNameControl !== null ? !this.employeeFirstNameControl?.isInvalid : true;
    returnValue = returnValue && firstNameIsValid;
    let lastNameIsValid = this.employeeLastNameControl !== null ? !this.employeeLastNameControl?.isInvalid : true;
    returnValue = returnValue && lastNameIsValid;
    let emailIsValid = this.employeeEmailControl !== null ? !this.employeeEmailControl?.isInvalid : true;
    returnValue = returnValue && emailIsValid;
    let phoneIsValid = this.employeePhoneControl !== null ? !this.employeePhoneControl?.isInvalid : true;
    returnValue = returnValue && phoneIsValid;

    return returnValue;
  }

  get departmentIdIsInvalid(): boolean {
    return this.employeeForm.controls['departmentIdString'].invalid; // && (this.control.touched || this.control.dirty);
  }
}
