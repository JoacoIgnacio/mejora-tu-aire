import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyCardPage } from './modify-card.page';

describe('ModifyCardPage', () => {
  let component: ModifyCardPage;
  let fixture: ComponentFixture<ModifyCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
