import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedTextboxComponent } from './validated-textbox.component';

describe('ValidatedTextboxComponent', () => {
  let component: ValidatedTextboxComponent;
  let fixture: ComponentFixture<ValidatedTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatedTextboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatedTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
