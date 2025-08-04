import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { faAsterisk, faCheckCircle, faUser, faWindowClose, faSave, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Employee } from './models/employee';
import { Department } from './models/department';
import { StatusMessageParameters } from './models/StatusMessageParameters';
import { EmployeeService } from './employee.service';
import { EmployeeTable } from './employee-table.component';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjToKeysPipe } from './Pipes/objToKeys';

@Component({
  selector: 'employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  providers: [EmployeeService],
  imports: [EmployeeTable,
    ReactiveFormsModule
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
    departmentIdString: '0',
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

  constructor(private http: HttpClient, private employeeService: EmployeeService) {
    this.employeeForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      email: new FormControl('', [Validators.email, Validators.maxLength(100)]),
      phone: new FormControl('', [Validators.maxLength(12)]),
      departmentIdString: new FormControl('', [Validators.required])
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
    this.employeeForm.get('firstName')?.setValue(this.employee.firstName);
    this.employeeForm.get('lastName')?.setValue(this.employee.lastName);
    this.employeeForm.get('email')?.setValue(this.employee.email);
    this.employeeForm.get('phone')?.setValue(this.employee.phone);
    this.employeeForm.get('departmentIdString')?.setValue(this.employee.departmentIdString);
  }

  async ngOnInit() {
    this.employee = await this.employeeService.getEmployee(0);
    this.getDepartments(0, 'list', '');
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
  firstNameErrorMessage: string = '';
  lastNameErrorMessage: string = '';
  phoneErrorMessage: string = '';
  emailErrorMessage: string = '';
  departmentErrorMessage: string = '';

  async Submit() {
    if (this.employeeForm.valid) {
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
    this.setInvalidMessages(event);
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

  setInvalidMessages(event: any) {
    this.firstNameErrorMessage = this.getInvalidMessage('firstName', 'first name');
    this.employee.firstName = this.employeeForm.controls['firstName'].value;
    this.lastNameErrorMessage = this.getInvalidMessage('lastName', 'last name');
    this.employee.lastName = this.employeeForm.controls['lastName'].value;
    this.phoneErrorMessage = this.getInvalidMessage('phone', 'phone number');
    this.employee.phone = this.employeeForm.controls['phone'].value;
    this.emailErrorMessage = this.getInvalidMessage('email', 'email address');
    this.employee.email = this.employeeForm.controls['email'].value;
    this.departmentErrorMessage = this.getInvalidMessage('departmentIdString', 'department');
  }
}
