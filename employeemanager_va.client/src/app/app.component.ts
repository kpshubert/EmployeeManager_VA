import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { faAsterisk, faCheckCircle, faUser } from '@fortawesome/free-solid-svg-icons';
//import { catchError } from 'rxjs/operators';
//import { throwError } from 'rxjs';

interface Employee {
  id: number,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  departmentId: number,
  departmentName: string
}

interface Department {
  id: number,
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
  public departments: Department[] = [{ id: 0, name: 'test'}, { id: 1, name: 'test2'}, {id: 3, name: 'test3' } ];

  public employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    departmentId: 0,
    departmentName: ''
  };

  public department: Department = {
    id: 0,
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
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  postEmployeeData() {
    const httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    this.http.post('/employee', this.employee, { headers: httpHeaders }).subscribe(response => {
      console.log(response);
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
}
