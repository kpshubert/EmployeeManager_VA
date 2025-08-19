import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Employee } from '../../Models/employee';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  public employees: Employee[] = [];

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
  constructor(private http: HttpClient) {
  }

  async getEmployees(idIn: number, modeIn: string, filterIn: string): Promise<Employee[]> {

    const parms = new HttpParams().set('id', idIn).set('mode', modeIn).set('filter', filterIn);

    const returnValue = await firstValueFrom(this.http.get<Employee[]>('/employee', { params: parms }));

    return returnValue;
  }

  async getEmployee(idIn: number): Promise<Employee> {

    const parms = new HttpParams().set('id', idIn).set('mode', '').set('filter', '');

    const returnValue = await firstValueFrom(this.http.get<Employee[]>('/employee', { params: parms }));

    return returnValue[0];
  }

  addEmployee() : Employee {
    this.employee['rowNum'] = 0;
    this.employee['id'] = 0;
    this.employee['firstName'] = '';
    this.employee['lastName'] = '';
    this.employee['phone'] = '';
    this.employee['email'] = '';
    this.employee['departmentId'] = 0;
    this.employee['departmentIdString'] = '';
    this.employee['departmentName'] = '';
    this.employee['formMode'] = 'add';
    return this.employee;
  }

  async postEmployeeData() {
    const httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    const processType = this.employee['formMode'] === 'edit' ? 'Employee update' : 'Employee add';
 
    try {
      let postReturn = this.http.post('/employee', this.employee, { headers: httpHeaders })
      const response = await firstValueFrom(postReturn);
      if (this.employee.formMode === 'add') {
        let employeeFromResponse: Employee = response as Employee;
        this.employee.id = employeeFromResponse.id;
        this.employee.formMode = 'edit';
      }
      console.log('Post successful: ', response);
      return processType + ' succeeded';
    } catch (error) {
      console.error('Post failed: ', error);
      return processType + ' failed.';
    }
  }

  async deleteEmployee(idIn: number) {
    const processType = 'Employee delete';
    const parms = new HttpParams().set('id', idIn);
    try {
      const response = await firstValueFrom(this.http.delete('/employee', { params: parms }));
      console.log('Delete successful:', response);
      return processType + ' succeeded';
    } catch (error) {
      console.error('Delete failed:', error);
      return processType + 'failed';
    }
  }
}
