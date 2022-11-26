import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorInfoComponent } from './tutor-info.component';

describe('TutorInfoComponent', () => {
  let component: TutorInfoComponent;
  let fixture: ComponentFixture<TutorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
