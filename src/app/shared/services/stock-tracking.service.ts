import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { ToastService } from '../toast/toast.service'
import { LocalStorageService } from './local-storage.service'

@Injectable({ providedIn: 'root' })
export class StockTrackingService {
  stocks$: Observable<string[]>

  private stocksSubject: BehaviorSubject<string[]>

  private readonly STORAGE_KEY = 'stocks'

  constructor(
    private localStorage: LocalStorageService,
    private toast: ToastService
  ) {
    const stocks = this.readStocksFromLocalStorage()

    this.stocksSubject = new BehaviorSubject(stocks)
    this.stocks$ = this.stocksSubject
      .asObservable()
      .pipe(tap(() => this.writeStocksToLocalStorage()))
  }

  track(stockCode: string): boolean {
    if (this.isBeingTracked(stockCode)) {
      this.toast.show(`${stockCode} is already being tracked.`)
      return false
    }

    this.stocksSubject.next([
      ...this.stocksSubject.value,
      stockCode.toUpperCase(),
    ])

    return true
  }

  stopTracking(stockCode: string) {
    const stocks = this.stocksSubject.value
    const updatedStocks = stocks.filter((code) => code !== stockCode)

    this.stocksSubject.next(updatedStocks)
  }

  isBeingTracked(stockCode: string) {
    return this.stocksSubject.value.includes(stockCode)
  }

  private readStocksFromLocalStorage() {
    if (!this.localStorage.hasItem(this.STORAGE_KEY)) {
      return []
    }

    const stringifiedStocks = String(
      this.localStorage.getItem(this.STORAGE_KEY)
    )
    return JSON.parse(stringifiedStocks)
  }

  private writeStocksToLocalStorage() {
    this.localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.stocksSubject.value)
    )
  }
}
