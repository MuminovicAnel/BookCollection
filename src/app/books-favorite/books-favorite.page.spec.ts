import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksFavoritePage } from './books-favorite.page';

describe('BooksFavoritePage', () => {
  let component: BooksFavoritePage;
  let fixture: ComponentFixture<BooksFavoritePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BooksFavoritePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksFavoritePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
