import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Department } from '../../Models/department';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  public departments: Department[] = [];

  public department: Department = {
    id: 0,
    idString: '',
    name: '',
    formMode: 'add'
  };
  constructor(private http: HttpClient) {
  }

  async getDepartments(idIn: number, modeIn: string, filterIn: string): Promise<Department[]> {

    const parms = new HttpParams().set('id', idIn).set('mode', modeIn).set('filter', filterIn);

    const returnValue = await firstValueFrom(this.http.get<Department[]>('/department', { params: parms }));

    return returnValue;
  }

  async getDepartment(idIn: number): Promise<Department> {

    const parms = new HttpParams().set('id', idIn).set('mode', '').set('filter', '');

    const returnValue = await firstValueFrom(this.http.get<Department[]>('/department', { params: parms }));

    return returnValue[0];
  }

  addDepartment(): Department {
    this.department['rowNum'] = 0;
    this.department['id'] = 0;
    this.department['idString'] = '';
    this.department['name'] = '';
    this.department['formMode'] = 'add';
    return this.department;
  }

  async postDepartmentData() {
    const httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    const processType = this.department['formMode'] === 'edit' ? 'Department update' : 'Department add';

    try {
      let postReturn = this.http.post('/department', this.department, { headers: httpHeaders })
      const response = await firstValueFrom(postReturn);
      if (this.department.formMode === 'add') {
        let departmentFromResponse: Department = response as Department;
        this.department.idString = departmentFromResponse.idString;
        this.department.formMode = 'edit';
      }
      console.log('Post successful: ', response);
      return processType + ' succeeded';
    } catch (error) {
      console.error('Post failed: ', error);
      return processType + ' failed.';
    }
  }

  async deleteDepartment(idIn: number) {
    const processType = 'Department delete';
    const parms = new HttpParams().set('id', idIn);
    try {
      const response = await firstValueFrom(this.http.delete('/department', { params: parms }));
      console.log('Delete successful:', response);
      return processType + ' succeeded';
    } catch (error) {
      console.error('Delete failed:', error);
      return processType + 'failed';
    }
  }
}
