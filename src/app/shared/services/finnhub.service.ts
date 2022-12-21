import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { StockQuoteDTO } from '../models/stock-quote'
import { SymbolLookupDTO } from '../models/symbol-lookup-dto'
import { formatDate } from '@angular/common'
import { Cache } from '../utils/decorators/cache'
import { InsiderSentimentDTO } from '../../sentiment/models/insider-sentiment'

@Injectable({ providedIn: 'root' })
export class FinnhubService {
  private readonly FINNHUB_TOKEN = 'bu4f8kn48v6uehqi3cqg'
  private readonly FINNHUB_URL = 'https://finnhub.io/api/v1'

  constructor(private http: HttpClient) {}

  @Cache('quotes')
  getQuote(stockCode: string): Observable<StockQuoteDTO> {
    const url = `${this.FINNHUB_URL}/quote`
    const params = { symbol: stockCode, token: this.FINNHUB_TOKEN }

    return this.http.get<StockQuoteDTO>(url, { params })
  }

  @Cache('symbol')
  lookUpSymbol(stockCode: string): Observable<SymbolLookupDTO> {
    const url = `${this.FINNHUB_URL}/search`
    const params = { q: stockCode, token: this.FINNHUB_TOKEN }

    return this.http.get<SymbolLookupDTO>(url, { params })
  }

  @Cache('sentiment')
  getInsiderSentiment(stockCode: string, initialDate: Date, finalDate: Date) {
    const url = `${this.FINNHUB_URL}/stock/insider-sentiment`

    const fmtDate = (d: Date) => formatDate(d, 'yyyy-MM-dd', 'en-US')
    const params = {
      symbol: stockCode,
      from: fmtDate(initialDate),
      to: fmtDate(finalDate),
      token: this.FINNHUB_TOKEN,
    }

    return this.http.get<InsiderSentimentDTO>(url, { params })
  }
}
