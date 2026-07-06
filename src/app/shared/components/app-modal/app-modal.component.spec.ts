import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  AppModalComponent,
} from './app-modal.component';

describe('AppModalComponent', () => {
  let fixture:
    ComponentFixture<AppModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModalComponent],
    }).compileComponents();

    fixture =
      TestBed.createComponent(AppModalComponent);

    fixture.componentRef.setInput(
      'title',
      'Modal de prueba',
    );

    fixture.detectChanges();
  });

  it('crea el modal reutilizable', () => {
    expect(fixture.componentInstance)
      .toBeTruthy();
  });
});
