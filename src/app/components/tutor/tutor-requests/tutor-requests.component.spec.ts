import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorRequestsComponent } from './tutor-requests.component';

describe('TutorRequestsComponent', () => {
  let component: TutorRequestsComponent;
  let fixture: ComponentFixture<TutorRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
