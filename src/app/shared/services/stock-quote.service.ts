import { Injectable } from '@angular/core'
import { StockTrackingService } from './stock-tracking.service'
import { forkJoin, Observable, of, zip } from 'rxjs'
import { map, switchMap, tap } from 'rxjs/operators'
import { StockQuote } from '../models/stock-quote'
import { SymbolLookupDTO } from '../models/symbol-lookup-dto'
import { FinnhubService } from './finnhub.service'
import { ToastService } from '../toast/toast.service'

@Injectable({ providedIn: 'root' })
export class StockQuoteService {
  stockQuotes$: Observable<StockQuote[]>

  constructor(
    private finnhub: FinnhubService,
    private stockTracker: StockTrackingService,
    private toast: ToastService
  ) {
    this.stockQuotes$ = this.stockTracker.stocks$.pipe(
      switchMap((stockCodes: string[]) => {
        if (stockCodes.length === 0) {
          return of([])
        }

        return zip(stockCodes.map((code) => this.getStock(code)))
      }
      ),
    )
  }

  getStockByCode(code: string) {
    return this.stockQuotes$.pipe(
      map((stocks) => stocks.find((s) => s.code === code))
    )
  }

  private getStock(stockCode: string): Observable<StockQuote> {
    return forkJoin({
      quote: this.finnhub.getQuote(stockCode),
      symbol: this.finnhub.lookUpSymbol(stockCode),
    }).pipe(
      tap((data) => {
        const { quote } = data

        if (quote.c === 0 && quote.d === null && quote.dp === null) {
          this.stockTracker.stopTracking(stockCode)
          this.toast.show(`Could not find any data for stock ${stockCode}`)
        }
      }),
      map((data) => {
        return StockQuote.fromDTO(
          data.quote,
          stockCode,
          this.getStockName(data.symbol)
        )
      })
    )
  }

  private getStockName(lookup: SymbolLookupDTO) {
    if (lookup.result.length > 0) {
      return lookup.result[0].description
    }

    return ''
  }
}
