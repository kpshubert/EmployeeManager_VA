import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeFormComponent],
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the requested employee from the server', () => {
    const mockEmployees = [{
      id: 0,
      firstName: 'test',
      lastName: 'employee',
      phone: '5018888888',
      email: 'test@testserver.com',
      departmentId: 0,
      departmentIdString: '',
      departmentName: 'Chief Cook and Bottle Washer',
      formMode: 'edit'
    }];

    const employeeReq = httpMock.expectOne('/employee');
    expect(employeeReq.request.method).toEqual('GET');
    employeeReq.flush(mockEmployees);
    component.ngOnInit();
    expect(component.employees).toEqual(mockEmployees);
  });

  it('should retrieve the requested department from the server', () => {
    const mockDepartment = {
      id: 0,
      idString: '0',
      name: 'test',
    }
    const departmentReq = httpMock.expectOne('/department');
    expect(departmentReq.request.method).toEqual('GET');
    departmentReq.flush(mockDepartment);
    component.ngOnInit();
    expect(component.department).toEqual(mockDepartment);
  });
});
