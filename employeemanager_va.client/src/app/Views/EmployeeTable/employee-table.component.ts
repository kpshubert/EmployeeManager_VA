import { CommonModule } from '@angular/common';
import { EventEmitter, Output, Input } from '@angular/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { faWindowClose, faUser } from '@fortawesome/free-solid-svg-icons';
import { Table, TableModule } from 'primeng/table';
import { EmployeeService } from '../../Services/Employee/employee.service';
import { Employee } from '../../Models/employee';
import { StatusMessageParameters } from '../../Models/StatusMessageParameters';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'employee-table',
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    TableModule
  ],
  providers: [EmployeeService, ConfirmationService]
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

  @Output() showStatusMessage: EventEmitter<StatusMessageParameters> = new EventEmitter();

  @Input() hasDepartments: boolean = true;

  applyFilterGlobal($event: any, stringVal: any) {
    this.dtEmployees?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  constructor(private employeeService: EmployeeService,
    private confirmationService: ConfirmationService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.employees = await this.employeeService.getEmployees(0, 'list', '');
  }

  faWindowClose = faWindowClose;
  faUser = faUser;
  deleteId: number = 0;

  editButtonClick(event: any, idIn: number) {
    this.reloadAfterClientEditClick.emit(idIn);
  }

  async deleteButtonClick(event: any, idIn: number) {
    this.deleteId = idIn;
    this.Confirm();
  }

  async refreshDataTable() {
    this.employees = await this.employeeService.getEmployees(0, 'list', '');
  }

  Confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure you wish to delete this employee?',
      header: 'Employee Manager (Angular)',
      accept: () => this.employeeDeleteAccept(),
      reject: () => this.employeeDeleteReject()
    });
  }

  async employeeDeleteAccept() {
    if (this.deleteId !== 0) {
      const statusMessage = await this.employeeService.deleteEmployee(this.deleteId);
      const messageParameters: StatusMessageParameters = { MessageText: statusMessage, TimeoutIn: 5 };
      this.showStatusMessage.emit(messageParameters);
      this.refreshDataTable();
      this.deleteId = 0;
    } else {
      const messageParameters: StatusMessageParameters = { MessageText: 'Employee not specified.', TimeoutIn: 5 };
      this.showStatusMessage.emit(messageParameters);
    }
  }

  employeeDeleteReject() {
    const messageParameters: StatusMessageParameters = { MessageText: 'User canceled request. Employee not deleted', TimeoutIn: 5 };
    this.showStatusMessage.emit(messageParameters);
    this.deleteId = 0;
  }
}
