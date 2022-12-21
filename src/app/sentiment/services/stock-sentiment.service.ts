import { Injectable } from '@angular/core'
import { map } from 'rxjs'
import {
  InsiderSentiment,
  InsiderSentimentDTO,
} from '../models/insider-sentiment'
import { FinnhubService } from '../../shared/services/finnhub.service'

@Injectable({ providedIn: 'root' })
export class StockSentimentService {
  constructor(private finnhub: FinnhubService) {}

  getInsiderSentimentFromLast3Months(stock: string) {
    const today = new Date()
    today.setDate(1)

    const sixMonthsAgo = this.getDateSixMonthsAgo(today)

    return this.finnhub.getInsiderSentiment(stock, sixMonthsAgo, today).pipe(
      map((response) => {
        const monthlySentiments = this.sortByDateAscending(response)
        const numOfResults = monthlySentiments.length

        const NUM_OF_MONTHS = 3
        if (numOfResults >= NUM_OF_MONTHS) {
          return monthlySentiments.splice(numOfResults - NUM_OF_MONTHS)
        }

        return monthlySentiments
      })
    )
  }

  private getDateSixMonthsAgo(today: Date) {
    const date = new Date()

    date.setFullYear(today.getFullYear())
    date.setMonth(today.getMonth() - 6)
    date.setDate(today.getDate())

    return date
  }

  private sortByDateAscending(
    response: InsiderSentimentDTO
  ): InsiderSentiment[] {
    return response.data
      .map((dto) => InsiderSentiment.fromDTO(dto))
      .sort((sentimentA, sentimentB) => {
        if (sentimentA.year != sentimentB.year) {
          return sentimentA.year - sentimentB.year
        }

        return sentimentA.month - sentimentB.month
      })
  }
}
