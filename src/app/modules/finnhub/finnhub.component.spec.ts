import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinnhubComponent } from './finnhub.component';

describe('FinnhubComponent', () => {
  let component: FinnhubComponent;
  let fixture: ComponentFixture<FinnhubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinnhubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinnhubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
