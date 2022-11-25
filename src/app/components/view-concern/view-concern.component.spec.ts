import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConcernComponent } from './view-concern.component';

describe('ViewConcernComponent', () => {
  let component: ViewConcernComponent;
  let fixture: ComponentFixture<ViewConcernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConcernComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
