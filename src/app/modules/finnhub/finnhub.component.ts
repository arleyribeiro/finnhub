import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FinnhubService } from 'src/app/core/services/finnhub.service';

@Component({
  selector: 'app-finnhub',
  templateUrl: './finnhub.component.html',
  styleUrls: ['./finnhub.component.scss'],
})
export class FinnhubComponent implements OnInit, OnDestroy {
  public data: any = [];
  public urlControl = new FormControl(null, [Validators.required]);
  public _setData: any = {};
  private _settings = {
    changePercentageThreshold: 0.03,
    highFrequencyPollingInterval: 2000,
    lowFrequencyPollingInterval: 15000,
  };

  private FINNHUB_DATA = 'finnhub-data';
  private _subscriptions = new Subscription();
  constructor(private _finnHubService: FinnhubService) {}

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const cache = sessionStorage.getItem(this.FINNHUB_DATA);
    this.data = cache ? JSON.parse(cache) : [];
    this._restartPollingStocks();
  }

  public resetAll(): void {
    this._setData = {};
    this.data = [];
    sessionStorage.removeItem(this.FINNHUB_DATA);
  }

  public pollingByStock(stock: any) {
    setTimeout(
      this._getDataFromUrl.bind(this, stock.url),
      stock.settings.interval
    );
  }

  public searchUrl() {
    const url = this.urlControl.value;
    if (url) this._getDataFromUrl(url);
    this.urlControl.reset();
  }

  private _getDataFromUrl(url: string): void {
    const symbol = this._getSymboName(url);
    if (!symbol) return;
    this._subscriptions.add(
      this._finnHubService.getDataFromUrl(url).subscribe((response) => {
        const stock = this._getStock(url, response, symbol);

        const interval = this._getPollingInterval(
          stock.currentPrice,
          stock.openPriceDay
        );

        const _stock = {
          ...stock,
          settings: {
            interval,
          },
          lastPull: new Date(),
        };
        this._setData[symbol] = _stock;
        this.data = Object.values(this._setData);
        sessionStorage.setItem(this.FINNHUB_DATA, JSON.stringify(this.data));
        this.pollingByStock(_stock);
      })
    );
  }

  private _restartPollingStocks() {
    (this.data || []).forEach((stock: any) => {
      this.pollingByStock(stock);
    });
  }

  private _getStock(url: string, response: any, symbol: string) {
    return {
      url: url,
      currentPrice: response.c,
      change: response.d,
      percentChange: response.dp,
      highPriceDay: response.h,
      lowPriceDay: response.l,
      openPriceDay: response.o,
      previousClosePrice: response.pc,
      timestamp: response.t,
      symbol: symbol,
    };
  }

  private _getPollingInterval(currentPrice: number, openPriceDay: number) {
    const percentageChange = Math.abs(openPriceDay - currentPrice) / 100.0;
    return Math.abs(percentageChange) >=
      this._settings.changePercentageThreshold
      ? this._settings.highFrequencyPollingInterval
      : this._settings.lowFrequencyPollingInterval;
  }

  private _getSymboName(url: string): string {
    if (!url) return '';
    const [http, params] = url.split('symbol=');
    const [symbol, token] = (params || '').split('&token=');
    return symbol;
  }
}
