import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementInfoComponent } from './engagement-info.component';

describe('EngagementInfoComponent', () => {
  let component: EngagementInfoComponent;
  let fixture: ComponentFixture<EngagementInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngagementInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngagementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
