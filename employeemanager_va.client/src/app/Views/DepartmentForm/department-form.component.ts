import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { faAsterisk, faCheckCircle, faUser, faWindowClose, faSave, faPlusCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Department } from '../..//Models/department';
import { StatusMessageParameters } from '../../Models/StatusMessageParameters';
import { DepartmentService } from '../../Services/Department/department.service';
import { DepartmentTable } from '../DepartmentTable/department-table.component';
import { ValidatedTextboxComponent } from '../../Shared/Modules/validated-textbox/validated-textbox.component';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ObjToKeysPipe } from '../../Pipes/objToKeys';
import { valHooks } from 'jquery';
import { SelectOptions } from '../../Models/select-options.data';
import { ActivatedRoute } from '@angular/router';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingDataComponent } from '../../Shared/Modules/loading-data/loading-data.component';

@Component({
  selector: 'department-form',
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css',
  providers: [
    DepartmentService
  ],
  imports: [
    DepartmentTable,
    ReactiveFormsModule,
    ValidatedTextboxComponent,
    FontAwesomeModule
  ]
})
export class DepartmentFormComponent implements OnInit {
  public departments: Department[] = [];

  public department: Department = {
    rowNum: 0,
    id: 0,
    idString: '',
    name: '',
    formMode: 'add',
    isAssigned: false
  };

  constructor(public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    library: FaIconLibrary) {
    this.departmentForm = this.fb.group({
    });
  }

  async reloadAfterClientEditClick(idIn: number) {
    if (idIn !== undefined) {
      const returnValue = await this.departmentService.getDepartment(idIn);
      this.department = returnValue;
      this.changeFormValues();
      this.saveButtonIcon = faSave;
      this.submitButtonText = 'Update';
    }
  }

  changeFormValues() {
    this.departmentNameControl?.externalValueChange(this.department.name);
    this.departmentForm.get('name')?.setValue(this.department.name);
    this.setInvalidMessages();
  }

  async ngOnInit() {
    this.openLoadingPanel();
    this.department = await this.departmentService.getDepartment(0);
    this.departments = await this.departmentService.getDepartments(0, 'list', '');
    this.setInvalidMessages();
    this.closeLoadingPanel();
  }

  @ViewChild('childDepartmentTable') childDepartmentTable: DepartmentTable | undefined;
  @ViewChild('departmentNameControl') departmentNameControl: ValidatedTextboxComponent | undefined;

  loadingOverlayRef!: OverlayRef;
  departmentForm: FormGroup;
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
    if (this.departmentForm.valid && this.customControlsAreValid()) {
      this.departmentService.department = this.department;
      this.processResultMessage = await this.departmentService.postDepartmentData();
      let submitButtonText: string = 'Update';
      let saveButtonIcon: IconDefinition = faSave;
      if (this.department.formMode === 'add') {
        submitButtonText = 'Add';
        saveButtonIcon  = faPlusCircle;
      }
      this.submitButtonText = submitButtonText;
      this.saveButtonIcon = saveButtonIcon;

      this.showStatusMessage({ MessageText: this.processResultMessage, TimeoutIn: 5 });
      await this.childDepartmentTable?.refreshDataTable();
    } else {
      this.showStatusMessage({ MessageText: 'Form has invalid data.', TimeoutIn: 5 });
    }
  }

  addButtonClick(event: any) {
    this.departmentService.department = this.department;
    this.departmentService.addDepartment();
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
    let formControl = this.departmentForm.controls[controlName];
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
    let nameErrorMessage = this.departmentNameControl?.errorMessage;
  }

  getFormControl<FormControl>(formControlName: string) {
    return this.departmentForm.controls[formControlName] as FormControl;
  }

  onSubControlBlur(value: any, updateField: string) {
    this.department[updateField] = value;
  }

  onSubControlChange(value: any, updateField: string) {
    this.department[updateField] = value;
  }

  customControlsAreValid() {
    let returnValue: boolean = true;

    let nameIsValid = this.departmentNameControl !== null ? !this.departmentNameControl?.isInvalid : true;
    returnValue = returnValue && nameIsValid;
  
    return returnValue;
  }

  openLoadingPanel() {
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    config.hasBackdrop = true;

    this.loadingOverlayRef = this.overlay.create(config);
    this.loadingOverlayRef.attach(new ComponentPortal(LoadingDataComponent, this.viewContainerRef));
  }

  closeLoadingPanel() {
    this.loadingOverlayRef.dispose();
  }

  togglePanel() {
    this.openLoadingPanel();
    setTimeout(() => {
      this.closeLoadingPanel();
    }, 5000);
  }
}
