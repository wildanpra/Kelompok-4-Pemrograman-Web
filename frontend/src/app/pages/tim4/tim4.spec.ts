import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tim4 } from './tim4';

describe('Tim4', () => {
  let component: Tim4;
  let fixture: ComponentFixture<Tim4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tim4],
    }).compileComponents();

    fixture = TestBed.createComponent(Tim4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
