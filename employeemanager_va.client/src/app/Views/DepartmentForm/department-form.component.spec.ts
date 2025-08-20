import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentFormComponent } from './department-form.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let component: DepartmentFormComponent;
  let fixture: ComponentFixture<DepartmentFormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentFormComponent],
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the requested department from the server', () => {
    const mockDepartments = [{
      id: 0,
      name: 'test',
      formMode: 'edit'
    }];

    const departmentReq = httpMock.expectOne('/department');
    expect(departmentReq.request.method).toEqual('GET');
    departmentReq.flush(mockDepartments);
    component.ngOnInit();
    expect(component.departments).toEqual(mockDepartments);
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
