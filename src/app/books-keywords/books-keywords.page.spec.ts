import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksKeywordsPage } from './books-keywords.page';

describe('BooksKeywordsPage', () => {
  let component: BooksKeywordsPage;
  let fixture: ComponentFixture<BooksKeywordsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksKeywordsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksKeywordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
