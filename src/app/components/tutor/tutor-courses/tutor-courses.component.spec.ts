import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCoursesComponent } from './tutor-courses.component';

describe('TutorCoursesComponent', () => {
  let component: TutorCoursesComponent;
  let fixture: ComponentFixture<TutorCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorCoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
