import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedSelectComponent } from './validated-select.component';

describe('ValidatedSelectComponent', () => {
  let component: ValidatedSelectComponent;
  let fixture: ComponentFixture<ValidatedSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatedSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatedSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
