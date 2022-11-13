import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTabComponent } from './attendance-tab.component';

describe('AttendanceTabComponent', () => {
  let component: AttendanceTabComponent;
  let fixture: ComponentFixture<AttendanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
