import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StockQuote } from '../shared/models/stock-quote';
import { StockQuoteService } from '../shared/services/stock-quote.service';
import { StockTrackingService } from '../shared/services/stock-tracking.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  quotes$!: Observable<StockQuote[]>;

  loadingStockData = false;

  query = '';

  constructor(
    private tracker: StockTrackingService,
    private quotes: StockQuoteService
  ) {}

  ngOnInit(): void {
    this.loadingStockData = this.tracker.isTrackingSomeStock();

    this.quotes$ = this.quotes.stockQuotes$.pipe(
      tap(() => {
        this.loadingStockData = false;
      })
    );
  }

  trackStock(stockCode: string) {
    this.loadingStockData = true;
    this.query = '';

    const isValidStockCode = this.tracker.track(stockCode);

    if (!isValidStockCode) {
      this.loadingStockData = false;
    }
  }

  stopTracking(stockCode: string) {
    this.tracker.stopTracking(stockCode);
  }

  putQueryInUpperCase() {
    this.query = this.query.toUpperCase();
  }
}
