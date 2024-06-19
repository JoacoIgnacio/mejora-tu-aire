import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCardPage } from './view-card.page';

describe('ViewCardPage', () => {
  let component: ViewCardPage;
  let fixture: ComponentFixture<ViewCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
