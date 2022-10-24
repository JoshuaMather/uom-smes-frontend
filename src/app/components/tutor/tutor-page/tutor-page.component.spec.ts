import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorPageComponent } from './tutor-page.component';

describe('TutorPageComponent', () => {
  let component: TutorPageComponent;
  let fixture: ComponentFixture<TutorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
