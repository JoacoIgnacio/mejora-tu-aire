import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchCardPage } from './search-card.page';

describe('SearchCardPage', () => {
  let component: SearchCardPage;
  let fixture: ComponentFixture<SearchCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
