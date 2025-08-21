import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { faWindowClose, faUser, faInfoCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Table, TableModule } from 'primeng/table';
import { DepartmentService } from '../../Services/Department/department.service';
import { Department } from '../../Models/department';
import { StatusMessageParameters } from '../../Models/StatusMessageParameters';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'department-table',
  templateUrl: './department-table.component.html',
  styleUrl: './department-table.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    TableModule,
    FontAwesomeModule
  ],
  providers: [DepartmentService, ConfirmationService]
})

export class DepartmentTable implements OnInit {
  public departments: Department[] = [];

  public columnNames = [
    { name: '', value: '', sort: '', filter: '' },
    { name: 'name', value: 'Department Name', sort: 'name', filter: 'name' }
  ];

  @ViewChild('dtDepartments') dtDepartments: Table | undefined;

  @Output() reloadAfterClientEditClick: EventEmitter<number> = new EventEmitter();

  @Output() showStatusMessage: EventEmitter<StatusMessageParameters> = new EventEmitter();

  applyFilterGlobal($event: any, stringVal: any) {
    this.dtDepartments?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  constructor(private departmentService: DepartmentService, private confirmationService: ConfirmationService, library: FaIconLibrary) {
  }

  async ngOnInit() {
    this.departments = await this.departmentService.getDepartments(0, 'list', '');
  }

  faWindowClose = faWindowClose;
  faUser = faUser;
  faInfoCircle = faInfoCircle;
  deleteId: number = 0;

  editButtonClick(event: any, idIn: number) {
    this.reloadAfterClientEditClick.emit(idIn);
  }

  async deleteButtonClick(event: any, idIn: number) {
    this.deleteId = idIn;
    this.Confirm();
  }

  async refreshDataTable() {
    this.departments = await this.departmentService.getDepartments(0, 'list', '');
  }

  Confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure you wish to delete this department?',
      header: 'Employee Manager (Angular)',
      accept: () => this.departmentDeleteAccept(),
      reject: () => this.departmentDeleteReject()
    });
  }

  async departmentDeleteAccept() {
    if (this.deleteId !== 0) {
      const statusMessage = await this.departmentService.deleteDepartment(this.deleteId);
      const messageParameters: StatusMessageParameters = { MessageText: statusMessage, TimeoutIn: 5 };
      this.showStatusMessage.emit(messageParameters);
      this.refreshDataTable();
      this.deleteId = 0;
    } else {
      const messageParameters: StatusMessageParameters = { MessageText: 'Department not specified.', TimeoutIn: 5 };
      this.showStatusMessage.emit(messageParameters);
    }
  }

  departmentDeleteReject() {
    const messageParameters: StatusMessageParameters = { MessageText: 'User canceled request. Department not deleted', TimeoutIn: 5 };
    this.showStatusMessage.emit(messageParameters);
    this.deleteId = 0;
  }
}
