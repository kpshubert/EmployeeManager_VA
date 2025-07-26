import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { faAsterisk, faCheckCircle, faUser, faWindowClose, faSave, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Employee } from './models/employee';
import { Department } from './models/department';
import { EmployeeService } from './employee.service';
import { EmployeeTable } from './employee-table.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  providers: [EmployeeService],
  imports: [EmployeeTable,
    FormsModule,
    EmployeeTable]
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

  constructor(private http: HttpClient, private employeeService: EmployeeService) {
  }

  async reloadAfterClientEditClick(idIn: number) {
    if (idIn !== undefined) {
      const returnValue = await this.employeeService.getEmployee(idIn);
      this.employee = returnValue;
      this.saveButtonIcon = faSave;
      this.submitButtonText = 'Update';
    }
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

  async Submit() {
    this.lazyLoadEmployeesTable('');
    this.employeeService.employee = this.employee;
    await this.employeeService.postEmployeeData();
    await this.childEmployeeTable?.refreshDataTable();
  }

  addButtonClick(event: any) {
    this.employeeService.employee = this.employee;
    this.employeeService.addEmployee();
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

  async lazyLoadEmployeesTable(event: any) {
     this.employee = await this.employeeService.getEmployee(0);
  }
}
