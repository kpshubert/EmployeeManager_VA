import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { faAsterisk, faCheckCircle, faUser, faWindowClose, faSave, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
//import * as $ from 'jquery';
//import { catchError } from 'rxjs/operators';
//import { throwError } from 'rxjs';

interface Employee {
  id: number,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  departmentId: number,
  departmentIdString: string,
  departmentName: string,
  formMode: string
}

interface Department {
  id: number,
  idString: string,
  name: string
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})

export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public departments: Department[] = [];

  public employee: Employee = {
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

  ngAfterViewInit() {
    this.setUpJqueryTestButton();
  }

  public department: Department = {
    id: 0,
    idString: '0',
    name: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEmployees(0, 'list', '');
    this.getDepartments(0, 'list', '');
  }

  getEmployees(idIn:number, modeIn:string, filterIn:string) {

    const parms = new HttpParams().set('id', idIn).set('mode', modeIn).set('filter', filterIn);

    this.http.get <Employee[]>('/employee', { params: parms } ).subscribe(
      (result) => {
        if (modeIn === 'list') {
          this.employees = result;
        }

        if (modeIn !== 'list' && result.length === 1) {
          this.employee = result[0];
          if (this.employee.formMode === 'edit') {
            this.saveButtonIcon = faSave;
            this.submitButtonText = 'Update';
          } else {
            this.saveButtonIcon = faPlusCircle;
            this.submitButtonText = "Add";
          }
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  addEmployee() {
    this.employee.id = 0;
    this.employee.firstName = '';
    this.employee.lastName = '';
    this.employee.phone = '';
    this.employee.email = '';
    this.employee.departmentId = 0;
    this.employee.departmentIdString = '0';
    this.employee.departmentName = '';
    this.employee.formMode = 'add';
    this.saveButtonIcon = faPlusCircle;
  }

  postEmployeeData() {
    const httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    this.http.post('/employee', this.employee, { headers: httpHeaders }).subscribe(response => {
      console.log(response);
    });

    this.getEmployees(0, 'list', '');
  }

  deleteEmployee(idIn: number) {
    const parms = new HttpParams().set('id', idIn);
    this.http.delete('/employee', {params: parms}).subscribe({
      next: data => {
        this.getEmployees(0, 'list', '');
      },
      error: error => { error.message }
    });
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

  title = 'EmployeeManager_VA.client';
  faCheckCircle = faCheckCircle;
  faAsterisk = faAsterisk;
  faUser = faUser;
  faWindowClose = faWindowClose;
  faSave = faSave;
  saveButtonIcon = faPlusCircle;
  submitButtonText = 'Add';

  employeeForm = new FormGroup({
    firstName: new FormControl(this.employee.firstName, Validators.required),
    lastName: new FormControl(this.employee.lastName, Validators.required),
    phone: new FormControl(this.employee.phone),
    email: new FormControl(this.employee.email),
    departmentId: new FormControl(this.employee.departmentId)
  });

  Submit() {
    this.postEmployeeData();
  }

  editButtonClick(event: any, id: number) {
    this.getEmployees(id, '', '');
  }

  deleteButtonClick(event: any, id: number) {
    this.deleteEmployee(id);
  }

  addButtonClick(event: any) {
    this.addEmployee();
  }

  departmentSelectChange(event: Event) {

    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedValueNumber = parseInt(selectedValue);

    this.employee.departmentId = selectedValueNumber;
  }

  setUpJqueryTestButton() {
    $("#btnJqueryTest").css('color', 'blue');
    $("#btnJqueryTest").on('click', function () {
      alert('Jquery event test!');
    });
  }
}
