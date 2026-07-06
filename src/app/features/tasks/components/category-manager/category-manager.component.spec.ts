import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoryManagerComponent } from './category-manager.component';

describe('CategoryManagerComponent', () => {
  let component: CategoryManagerComponent;
  let fixture: ComponentFixture<CategoryManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CategoryManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

});


