import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AppComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve weather forecasts from the server', () => {
    const mockForecasts = [
      { date: '2021-10-01', temperatureC: 20, temperatureF: 68, summary: 'Mild' },
      { date: '2021-10-02', temperatureC: 25, temperatureF: 77, summary: 'Warm' }
    ];

    it('should retreive the requested employee from the server', () => {
      const mockEmployee = {
        id: 0,
        firstName: 'test',
        lastName: 'employee',
        phone: '5018888888',
        email: 'test@testserver.com',
        departmentId: 0
        departmentName: 'Chief Cook and Bottle Washer'
      };

      it('should retreive the requested department from the server', () => {
        const mockDepartment = {
          id: 0,
          name: 'test',
        };

        component.ngOnInit();

        const req = httpMock.expectOne('/weatherforecast');
        expect(req.request.method).toEqual('GET');
        req.flush(mockForecasts);

        const employeeReq = httpMock.expectOne('/employee');
        expect(employeeReq.request.method).toEqual('GET');
        employeeReq.flush(mockEmployee);

        const departmentReq = httpMock.expectOne('/department');
        expect(departmentReq.request.method).toEqual('GET');
        departmentReq.flush(mockDepartment);

        expect(component.forecasts).toEqual(mockForecasts);
        expect(component.employee).toEqual(mockEmployee);
        //expect(component.department).toEqual(mockDepartment);
  });
});
