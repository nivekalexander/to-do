import { signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  Category,
} from '../../../../shared/models/category.model';
import {
  CategoriesFacade,
} from '../../data-access/categories.facade';
import {
  CategoryListPage,
} from './category-list.page';

describe('CategoryListPage', () => {
  let fixture:
    ComponentFixture<CategoryListPage>;

  const facadeMock = {
    loading: signal(false),
    categories: signal<readonly Category[]>([]),
    initialize: jasmine
      .createSpy('initialize')
      .and.resolveTo(),
    addCategory: jasmine
      .createSpy('addCategory')
      .and.resolveTo(),
    updateCategory: jasmine
      .createSpy('updateCategory')
      .and.resolveTo(),
    deleteCategory: jasmine
      .createSpy('deleteCategory')
      .and.resolveTo(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListPage],
      providers: [
        provideRouter([]),
        {
          provide: CategoriesFacade,
          useValue: facadeMock,
        },
      ],
    }).compileComponents();

    fixture =
      TestBed.createComponent(CategoryListPage);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('inicia la feature al abrir la pagina', () => {
    expect(facadeMock.initialize)
      .toHaveBeenCalled();
  });
});
