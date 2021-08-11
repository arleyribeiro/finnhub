import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';

export interface Quote {
  currentPrice: any;
  change: any;
  percentChange: any;
  highPriceDay: any;
  lowPriceDay: any;
  openPriceDay: any;
  previousClosePrice: any;
  symbol: any;
  timestamp: any;
}

@Component({
  selector: 'app-finnhub-data',
  templateUrl: './finnhub-data.component.html',
  styleUrls: ['./finnhub-data.component.scss'],
})
export class FinnhubDataComponent implements OnInit {
  displayedColumns: string[] = [
    'symbol',
    'timestamp',
    'openPrice',
    'lastPrice',
    'changePercentage',
    'options',
  ];
  @Input() public dataSource: any = [];
  @Output('reset') public _resetEvent = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit(): void {}

  public resetAll(): void {
    this._resetEvent.emit(true);
  }
}
