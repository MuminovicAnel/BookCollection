import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksScanPage } from './books-scan.page';

describe('BooksScanPage', () => {
  let component: BooksScanPage;
  let fixture: ComponentFixture<BooksScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BooksScanPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
