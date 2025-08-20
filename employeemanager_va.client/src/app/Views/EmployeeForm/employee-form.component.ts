import { Component, OnInit, ViewChild } from '@angular/core';
import { faAsterisk, faCheckCircle, faUser, faWindowClose, faSave, faPlusCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Employee } from '../../Models/employee';
import { Department } from '../..//Models/department';
import { StatusMessageParameters } from '../../Models/StatusMessageParameters';
import { EmployeeService } from '../../Services/Employee/employee.service';
import { DepartmentService } from '../../Services/Department/department.service';
import { EmployeeTable } from '../EmployeeTable/employee-table.component';
import { ValidatedTextboxComponent } from '../../Shared/Modules/validated-textbox/validated-textbox.component';
import { ValidatedSelectComponent } from '../../Shared/Modules/validated-select/validated-select.component';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ObjToKeysPipe } from '../../Pipes/objToKeys';
import { valHooks } from 'jquery';
import { SelectOptions } from '../../Models/select-options.data';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  providers: [
    EmployeeService,
    DepartmentService
  ],
  imports: [EmployeeTable,
    ReactiveFormsModule,
    ValidatedTextboxComponent,
    ValidatedSelectComponent,
    FontAwesomeModule
  ]
})
export class EmployeeFormComponent implements OnInit {
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
    name: '',
    formMode: 'add'
  };

  employeeForm: FormGroup;

  constructor( private route: ActivatedRoute, private employeeService: EmployeeService, private departmentService: DepartmentService, private fb: FormBuilder, library: FaIconLibrary) {
    this.employeeForm = this.fb.group({
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
    this.employeeDepartmentControl?.externalValueChange(this.employee.departmentIdString);
    this.employeeForm.get('departmentIdString')?.setValue(this.employee.departmentIdString);
    this.setInvalidMessages();
  }

  async ngOnInit() {
    this.employee = await this.employeeService.getEmployee(0);
    this.departments = await this.departmentService.getDepartments(0, 'list', '');
    this.setInvalidMessages();
    this.departmentOptions = await this.createDepartmentOptions();
    if (this.employeeDepartmentControl !== null && this.employeeDepartmentControl !== undefined) {
      this.employeeDepartmentControl.selectOptions = await this.createDepartmentOptions();
    }
  }

  @ViewChild('childEmployeeTable') childEmployeeTable: EmployeeTable | undefined;
  @ViewChild('employeeFirstNameControl') employeeFirstNameControl: ValidatedTextboxComponent | undefined;
  @ViewChild('employeeLastNameControl') employeeLastNameControl: ValidatedTextboxComponent | undefined;
  @ViewChild('employeePhoneControl') employeePhoneControl: ValidatedTextboxComponent | undefined;
  @ViewChild('employeeEmailControl') employeeEmailControl: ValidatedTextboxComponent | undefined;
  @ViewChild('employeeDepartmentControl') employeeDepartmentControl: ValidatedSelectComponent | undefined;

  title = 'EmployeeManager_VA.client';
  faCheckCircle = faCheckCircle;
  faAsterisk = faAsterisk;
  faUser = faUser;
  faWindowClose = faWindowClose;
  faSave = faSave;
  saveButtonIcon = faPlusCircle;
  faPlusCircle = faPlusCircle;
  submitButtonText = 'Add';
  statusMessage = '';
  processResultMessage = '';
  departmentErrorMessage: string = '';
  departmentOptions: SelectOptions[] = [];

  async Submit() {
    this.setInvalidMessages();
    if (this.employeeForm.valid && this.customControlsAreValid()) {
      let newDepartmentId: number = parseInt(this.employee['departmentIdString'], 10);
      this.employee['departmentId'] = newDepartmentId;
      this.employeeService.employee = this.employee;
      this.processResultMessage = await this.employeeService.postEmployeeData();
      let submitButtonText: string = 'Update';
      let saveButtonIcon: IconDefinition = faSave;
      if (this.employee.formMode === 'add') {
        submitButtonText = 'Add';
        saveButtonIcon  = faPlusCircle;
      }
      this.submitButtonText = submitButtonText;
      this.saveButtonIcon = saveButtonIcon;

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
    this.submitButtonText = 'Add';
    this.saveButtonIcon = faPlusCircle;
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
    let departmentErrorMessage = this.employeeDepartmentControl?.errorMessage
  }

  getFormControl<FormControl>(formControlName: string) {
    return this.employeeForm.controls[formControlName] as FormControl;
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

  async createDepartmentOptions() {
    let departmentOptions: SelectOptions[] = []

    let departmentRecords: Department[] = await this.departmentService.getDepartments(0, 'list', '');

    for (let departmentOption of departmentRecords) {
      let departmentOpt = { key: departmentOption.idString, value: departmentOption.name }
      departmentOptions.push(departmentOpt);
    }
    return departmentOptions;
  }
}
