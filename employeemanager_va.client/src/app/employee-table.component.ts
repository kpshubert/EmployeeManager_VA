import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { faWindowClose, faUser } from '@fortawesome/free-solid-svg-icons';
import { Table, TableModule } from 'primeng/table';
import { EmployeeService } from './employee.service';
import { Employee } from './models/employee';

@Component({
  selector: 'employee-table',
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, TableModule],
  providers: [EmployeeService]
})

export class EmployeeTable implements OnInit {
  public employees: Employee[] = [];

  public columnNames = [
    { name: '', value: '', sort: '', filter: '' },
    { name: 'firstName', value: 'First Name', sort: 'firstName', filter: 'firstName' },
    { name: 'lastName', value: 'Last Name', sort: 'lastName', filter: 'lastName' },
    { name: 'email', value: 'Email', sort: 'email', filter: 'email' },
    { name: 'phone', value: 'Phone', sort: 'phone', filter: 'phone' },
    { name: 'departmentName', value: 'Department Name', sort: 'departmentName', filter: 'departmentName' }
  ];

  @ViewChild('dtEmployees') dtEmployees: Table | undefined;

  @Output() reloadAfterClientEditClick: EventEmitter<number> = new EventEmitter();

  applyFilterGlobal($event: any, stringVal: any) {
    this.dtEmployees?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  constructor(private employeeService: EmployeeService) {
  }

  async ngOnInit() {
    this.employees = await this.employeeService.getEmployees(0, 'list', '');
  }

  faWindowClose = faWindowClose;
  faUser = faUser;

  editButtonClick(event: any, idIn: number) {
    this.reloadAfterClientEditClick.emit(idIn);
  }
  async deleteButtonClick(event: any, idIn: number) {
    await this.employeeService.deleteEmployee(idIn);
    this.refreshDataTable();
  }

  async refreshDataTable() {
    this.employees = await this.employeeService.getEmployees(0, 'list', '');
  }
}
