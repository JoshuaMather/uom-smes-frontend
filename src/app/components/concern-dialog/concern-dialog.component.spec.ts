import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcernDialogComponent } from './concern-dialog.component';

describe('ConcernDialogComponent', () => {
  let component: ConcernDialogComponent;
  let fixture: ComponentFixture<ConcernDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcernDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcernDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
