import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { combineLatest, map, Observable } from 'rxjs'
import { InsiderSentiment } from './models/insider-sentiment'
import { StockQuote } from '../shared/models/stock-quote'
import { StockQuoteService } from '../shared/services/stock-quote.service'
import { StockSentimentService } from './services/stock-sentiment.service'

@Component({
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.css'],
})
export class SentimentComponent implements OnInit {
  data$!: Observable<{
    stock: StockQuote | undefined
    monthlySentiment: InsiderSentiment[]
  }>

  private stockCode = ''

  constructor(
    private route: ActivatedRoute,
    private stocksService: StockQuoteService,
    private sentimentService: StockSentimentService
  ) {}

  ngOnInit(): void {
    this.stockCode = String(this.route.snapshot.paramMap.get('stockCode'))

    const stock = this.stocksService.getStockByCode(this.stockCode)

    const monthlySentiment =
      this.sentimentService.getInsiderSentimentFromLast3Months(this.stockCode)

    this.data$ = combineLatest([stock, monthlySentiment]).pipe(
      map(([stock, monthlySentiment]) => ({ stock, monthlySentiment }))
    )
  }

  getFormattedStockName(stock: StockQuote | undefined) {
    return stock?.formattedName() || this.stockCode
  }

  getShortStockName(stock: StockQuote | undefined) {
    return stock?.name || this.stockCode
  }
}
