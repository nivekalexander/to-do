import { TestBed } from '@angular/core/testing';

import {
  TodoStore,
} from '../../../shared/data-access/todo-store';
import {
  CategoriesFacade,
} from './categories.facade';

describe('CategoriesFacade', () => {
  const storeMock = {
    loading: () => false,
    categories: () => [],
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriesFacade,
        {
          provide: TodoStore,
          useValue: storeMock,
        },
      ],
    });
  });

  it('delega la creacion de categorias', async () => {
    const facade =
      TestBed.inject(CategoriesFacade);

    await facade.addCategory('Trabajo');

    expect(storeMock.addCategory)
      .toHaveBeenCalledWith('Trabajo');
  });
});
