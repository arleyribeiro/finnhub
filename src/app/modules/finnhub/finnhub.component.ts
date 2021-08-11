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
  public pollingTime = 15000;

  private FINNHUB_DATA = 'finnhub-data';
  private _subscriptions = new Subscription();
  constructor(private _finnHubService: FinnhubService) {}

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const cache = sessionStorage.getItem(this.FINNHUB_DATA);
    this.data = cache ? JSON.parse(cache) : [];
    this.updateQuotes();
  }

  public resetAll(): void {
    this._setData = {};
    this.data = [];
    sessionStorage.removeItem(this.FINNHUB_DATA);
  }

  public updateQuotes() {
    console.log(this.pollingTime++);
    if (this.data) {
      this.data.forEach((quote: any) => {
        this.getDataFromUrl(quote.url);
      });
    }
    this.polling();
  }

  public polling() {
    setTimeout(this.updateQuotes.bind(this), this.pollingTime);
  }

  public searchUrl() {
    const url = this.urlControl.value;
    if (url) this.getDataFromUrl(url);
    this.urlControl.reset();
  }

  public getDataFromUrl(url: string): void {
    const symbol = this.getSymboName(url);
    if (!symbol) return;
    this._subscriptions.add(
      this._finnHubService.getDataFromUrl(url).subscribe((response) => {
        const value = {
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

        this._setData[symbol] = {
          ...value,
          settings: {
            changePercentageThreshold: 3000,
            highFrequencyPollingInterval: 2000,
            lowFrequencyPollingInterval: 15000,
          },
        };
        this.data = Object.values(this._setData);
        sessionStorage.setItem(this.FINNHUB_DATA, JSON.stringify(this.data));
      })
    );
  }

  private getSymboName(url: string): string {
    if (!url) return '';
    const [http, params] = url.split('symbol=');
    const [symbol, token] = (params || '').split('&token=');
    return symbol;
  }
}
