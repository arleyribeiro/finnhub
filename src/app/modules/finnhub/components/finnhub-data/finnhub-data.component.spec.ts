import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinnhubDataComponent } from './finnhub-data.component';

describe('FinnhubDataComponent', () => {
  let component: FinnhubDataComponent;
  let fixture: ComponentFixture<FinnhubDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinnhubDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinnhubDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
