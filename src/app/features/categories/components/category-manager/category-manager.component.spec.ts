import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  CategoryManagerComponent,
} from './category-manager.component';

describe('CategoryManagerComponent', () => {
  let component: CategoryManagerComponent;
  let fixture:
    ComponentFixture<CategoryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryManagerComponent],
    }).compileComponents();

    fixture =
      TestBed.createComponent(
        CategoryManagerComponent,
      );

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('crea una categoria valida', () => {
    const emitSpy = spyOn(
      component.categoryCreated,
      'emit',
    );

    component.createForm.setValue({
      name: 'Trabajo',
    });

    component.createCategory();

    expect(emitSpy)
      .toHaveBeenCalledWith('Trabajo');
  });
});
